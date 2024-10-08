import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import axios from 'axios';
import { Button, Select, MenuItem, FormControl, InputLabel, Menu } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import html2canvas from 'html2canvas';
import { apiKey } from './const';

const DiagramComponent = ({ summary, diagramType, setDiagramType }) => {
  const mermaidRef = useRef(null);
  const [diagramSvg, setDiagramSvg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const api = apiKey;

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
  }, []);

  // Generate diagram when component is mounted and summary changes
  useEffect(() => {
    if (summary) {
      generateDiagram();
    }
  }, [summary, diagramType]);

  const generateDiagram = async (retryCount = 0) => {
    if (!mermaidRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const diagramDef = await generateDiagramDefinition(summary);

      const cleanedDiagramDef = diagramDef
        .replace(/```mermaid/g, '')
        .replace(/```/g, '')
        .trim();

      const { svg } = await mermaid.render('mermaid-diagram', cleanedDiagramDef);
      setDiagramSvg(svg);
    } catch (error) {
      if (retryCount < 3) {
        console.log(`Retry attempt ${retryCount + 1}`);
        await generateDiagram(retryCount + 1);
      } else {
        setError('Không thể tạo biểu đồ sau nhiều lần thử. Vui lòng kiểm tra định dạng đầu vào.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateDiagramDefinition = async (text) => {
    try {
      let promptText;
      switch (diagramType) {
        case 'flowchart':
          promptText = `Chuyển văn bản sau thành định nghĩa biểu đồ Mermaid hợp lệ với cú pháp 'flowchart TD'. Sử dụng các ký hiệu như A[...], B(...), C{...}, và mũi tên --> để kết nối các nút, dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa biểu đồ mới. Chỉ cung cấp code:
\`\`\`mermaid
flowchart TD
    A[Bắt đầu] --> B(Xử lý)
    B --> C{Quyết định}
    C -->|Có| D[Kết quả 1]
    C -->|Không| E[Kết quả 2]
${text}
\`\`\``;
          break;
        case 'mindmap':
          promptText = `Chuyển văn bản sau thành định nghĩa mind map Mermaid hợp lệ và đơn giản, sử dụng nhiều emoji hoặc ký tự Unicode để tạo hiệu ứng vui nhộn và gần giống meme. Dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa mind map mới, nhưng hãy làm cho mind map đó sao cho dễ nhìn, dễ đọc, tối giản, nội dung các nhánh bằng tiếng việt, các nhánh không nằm chồng chéo lên nhau. Chỉ cung cấp code:
          \`\`\`mermaid
          mindmap
            root((🤯 Mind-blowing Map))
              Origins
                📚🕰️ Long history
                🎭 Popularisation
                  🧠💥 Tony Buzan's brain explosion
              Research
                📊🔬 On effectiveness
                🤖💡 On Automatic creation
                  Uses
                      🎨💭 Creative techniques
                      🏆🗺️ Strategic planning
                      🗣️🤼 Argument mapping
              Tools
                🖊️📜 Old school: Pen and paper
                🖥️🧜‍♀️ New cool: Mermaid
              Meme potential
                🐸☕ "But that's none of my business"
                🤔💭 "Not sure if mindmap or modern art"
                🦄🌈 "Unicorn thoughts"
          ${text}
          \`\`\``;
          break;
        case 'classDiagram':
          promptText = `Chuyển văn bản sau thành định nghĩa class diagram Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa class diagram mới. Chỉ cung cấp code:
\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
${text}
\`\`\``;
          break;
        case 'sequence':
          promptText = `Chuyển văn bản sau thành định nghĩa sequence diagram Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa sequence diagram mới. Chỉ cung cấp code:
\`\`\`mermaid
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!
${text}
\`\`\``;
          break;
        case 'erDiagram':
          promptText = `Chuyển văn bản sau thành định nghĩa ER diagram Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa ER diagram mới. Chỉ cung cấp code:
\`\`\`mermaid
erDiagram
    CUSTOMER }|..|{ DELIVERY-ADDRESS : has
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ INVOICE : "liable for"
    DELIVERY-ADDRESS ||--o{ ORDER : receives
    INVOICE ||--|{ ORDER : covers
    ORDER ||--|{ ORDER-ITEM : includes
    PRODUCT-CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ ORDER-ITEM : "ordered in"
${text}
\`\`\``;
          break;
        case 'userJourney':
          promptText = `Chuyển văn bản sau thành định nghĩa user journey Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa user journey mới. Chỉ cung cấp code:
\`\`\`mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
${text}
\`\`\``;
          break;
        case 'zenuml':
          promptText = `Chuyển văn bản sau thành định nghĩa ZenUML hợp lệ dựa trên cấu trúc có dạng như ví dụ như sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa ZenUML mới. Chỉ cung cấp code:
\`\`\`mermaid
zenuml
    title Order Service
    @Actor Client #FFEBE6
    @Boundary OrderController #0747A6
    @EC2 <<BFF>> OrderService #E3FCEF
    group BusinessService {
      @Lambda PurchaseService
      @AzureFunction InvoiceService
    }

    @Starter(Client)
    // \`POST /orders\`
    OrderController.post(payload) {
      OrderService.create(payload) {
        order = new Order(payload)
        if(order != null) {
          par {
            PurchaseService.createPO(order)
            InvoiceService.createInvoice(order)      
          }      
        }
      }
    }
${text}
\`\`\``;
          break;
        case 'stateDiagram':
          promptText = `Chuyển văn bản sau thành định nghĩa state diagram Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ như sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa state diagram mới. Chỉ cung cấp code:
\`\`\`mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
${text}
\`\`\``;
          break;
        case 'block':
          promptText = `Chuyển văn bản sau thành định nghĩa block diagram Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ như sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa block diagram mới. Chỉ cung cấp code:
\`\`\`mermaid
block-beta
    columns 3
    doc>"Document"]:3
    space down1<[" "]>(down) space

  block:e:3
          l["left"]
          m("A wide one in the middle")
          r["right"]
  end
    space down2<[" "]>(down) space
    db[("DB")]:3
    space:3
    D space C
    db --> D
    C --> db
    D --> C
    style m fill:#d6d,stroke:#333,stroke-width:4px
${text}
\`\`\``;
          break;
        case 'architect':
          promptText = `Chuyển văn bản sau thành định nghĩa architecture diagram Mermaid hợp lệ dựa trên cấu trúc có dạng như ví dụ sau, nếu không thể tạo ra từ văn bản đầu vào thì hãy tự sáng tạo để tạo ra một định nghĩa architecture diagram mới. Chỉ cung cấp code:
          \`\`\`mermaid
          architecture-beta
              group api(cloud)[API]
          
              service db(database)[Database] in api
              service disk1(disk)[Storage] in api
              service disk2(disk)[Storage] in api
              service server(server)[Server] in api
          
              db:R -- L:server
              disk1:T -- B:server
              disk2:T -- B:db
          ${text}
          \`\`\``;
          break;
        case 'advancedFlowchart':
          promptText = `Create a Mermaid advanced flowchart definition based on the following text, using advanced features like subgraphs, different node shapes, and custom styling. If you can't create it from the input text, please create a new advanced flowchart definition. Only provide the code:
  \`\`\`mermaid
  graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange
  ${text}
  \`\`\``;
        default:
          throw new Error('Unsupported diagram type');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api}`,
        {
          contents: [
            {
              parts: [
                {
                  text: promptText
                }
              ]
            }
          ]
        }
      );
      const generatedText = response.data?.candidates[0]?.content?.parts[0]?.text || '';
      
      // Check if the generated text contains a valid Mermaid diagram
      if (!generatedText.includes('```mermaid') || !generatedText.includes('```')) {
        throw new Error('Invalid diagram definition');
      }
      
      return generatedText;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleZoom = () => {
    // Tạo một tab mới với hình ảnh SVG
    const newWindow = window.open('', '_blank');
    newWindow.document.write('<html><head><title>Biểu đồ Mermaid</title></head><body>');
    newWindow.document.write(diagramSvg);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format) => {
    let blob;
    let fileName;

    if (format === 'svg') {
      blob = new Blob([diagramSvg], { type: 'image/svg+xml;charset=utf-8' });
      fileName = 'diagram.svg';
    } else {
      const canvas = await html2canvas(mermaidRef.current);
      blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${format}`));
      fileName = `diagram.${format}`;
    }

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    handleDownloadClose();
  };

  const handleDiagramTypeChange = (event) => {
    setDiagramType(event.target.value);
  };

  return (
    <div>
      {isLoading ? (
        <div>Đang tạo biểu đồ...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div
          ref={mermaidRef}
          dangerouslySetInnerHTML={{ __html: diagramSvg }}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
      <div className="mt-2 flex justify-end space-x-2">
        <Button
          variant="contained"
          startIcon={<ZoomInIcon />}
          onClick={handleZoom}
        >
          Mở trong tab mới
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleDownloadClick}
        >
          Tải về
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDownloadClose}
        >
          <MenuItem onClick={() => handleDownload('svg')}>SVG</MenuItem>
          <MenuItem onClick={() => handleDownload('png')}>PNG</MenuItem>
          <MenuItem onClick={() => handleDownload('jpg')}>JPG</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default DiagramComponent;