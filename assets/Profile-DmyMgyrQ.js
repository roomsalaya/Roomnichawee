import{r as n,j as s}from"./index-Cmh9xFDU.js";import{x as h,y as a,F as x,q as o,w as j}from"./Footer-CeENDa52.js";import{N as u}from"./Navbar-CUWQJ0m4.js";const D=()=>{const[e,i]=n.useState(null),d=h(),t=a(),r=d.currentUser;return n.useEffect(()=>{r&&(async()=>{const l=o(t,"users",r.uid),c=await j(l);c.exists()?i(c.data()):console.log("No such document!")})()},[r,t]),r?s.jsxs(s.Fragment,{children:[s.jsx(u,{}),s.jsxs("div",{className:"container",children:[s.jsx("h2",{children:"ข้อมูลโปรไฟล์"}),e?s.jsx("table",{className:"profile-table",children:s.jsxs("tbody",{children:[s.jsxs("tr",{children:[s.jsx("th",{children:"ชื่อ :"}),s.jsx("td",{children:e.name})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"ห้อง :"}),s.jsx("td",{children:e.room})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"อีเมล :"}),s.jsx("td",{children:r.email})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"เบอร์โทรศัพท์ :"}),s.jsx("td",{children:e.phone})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"สัญญาเช่า :"}),s.jsx("td",{children:e.rental})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"ค่าเช่า :"}),s.jsx("td",{children:e.rent})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"ค่าน้ำ :"}),s.jsxs("td",{children:[e.water," บาท"]})]}),s.jsxs("tr",{children:[s.jsx("th",{children:"ค่าไฟ หน่วยละ :"}),s.jsxs("td",{children:[e.electricity," บาท"]})]})]})}):s.jsx("p",{className:"loading-message",children:"กำลังโหลดข้อมูล..."})]}),s.jsx(x,{})]}):s.jsx("p",{children:"โปรดเข้าสู่ระบบ"})};export{D as default};
