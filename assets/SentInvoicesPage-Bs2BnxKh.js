import{p as o,L as F,K as w,q as t,N as L,S as R,aQ as x,aR as U,F as Y,t as b,s as C}from"./index-DvTBtECc.js";const{Option:E}=x,B=()=>{const[i,f]=o.useState([]),[u,c]=o.useState(!0),[l,p]=o.useState(null),d=F(),h=w(),[y,v]=o.useState(null);o.useEffect(()=>{(async()=>{c(!0);try{const n=h.currentUser;if(n){const a=n.email,m=(a==null?void 0:a.split("@")[0])||null;v(m);const j=b(d,"invoices"),k=(await C(j)).docs.map(r=>r.data()).filter(r=>r.room===m);f(k)}}catch(n){console.error("Error fetching invoices data: ",n)}finally{c(!1)}})()},[d,h]);const g=e=>{p(e)},s={มกราคม:1,กุมภาพันธ์:2,มีนาคม:3,เมษายน:4,พฤษภาคม:5,มิถุนายน:6,กรกฎาคม:7,สิงหาคม:8,กันยายน:9,ตุลาคม:10,พฤศจิกายน:11,ธันวาคม:12},I=l?i.filter(e=>e.year===l-543).sort((e,n)=>(s[e.month]||0)-(s[n.month]||0)):i.sort((e,n)=>(s[e.month]||0)-(s[n.month]||0)),S=[{title:"ห้อง",dataIndex:"room",key:"room"},{title:"เดือนที่แจ้งหนี้",dataIndex:"month",key:"month"},{title:"ปี (พ.ศ.)",dataIndex:"year",key:"year",render:e=>e+543},{title:"ค่าเช่า (บาท)",dataIndex:"rent",key:"rent"},{title:"ค่าน้ำ (บาท)",dataIndex:"water",key:"water"},{title:"ค่าไฟ (บาท)",dataIndex:"electricity",key:"electricity"},{title:"ค่าปรับ (บาท)",dataIndex:"fine",key:"fine"},{title:"ยอดรวม (บาท)",dataIndex:"total",key:"total"},{title:"สถานะห้อง",dataIndex:"roomStatus",key:"roomStatus"},{title:"ดาวน์โหลด PDF",dataIndex:"pdfUrl",key:"pdfUrl",render:e=>e?t.jsx("a",{href:e,target:"_blank",rel:"noopener noreferrer",children:"ดาวน์โหลด"}):"ไม่มีไฟล์"}];return t.jsxs(t.Fragment,{children:[t.jsx(L,{}),t.jsxs("div",{className:"sent-invoices-container",children:[t.jsx("h3",{children:"บิลแจ้งหนี้"}),u?t.jsx(R,{size:"large"}):y?t.jsxs(t.Fragment,{children:[t.jsx(x,{style:{width:200,marginBottom:20},placeholder:"เลือกปี",onChange:g,children:Array.from({length:11},(e,n)=>2567+n).map(e=>t.jsx(E,{value:e,children:e},e))}),t.jsx(U,{dataSource:I,columns:S,rowKey:"room",pagination:{pageSize:10}})]}):t.jsx("p",{children:"กรุณาล็อกอินเพื่อดูข้อมูล"})]}),t.jsx(Y,{})]})};export{B as default};
