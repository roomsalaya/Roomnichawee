import{r as i,j as s}from"./index-Cmh9xFDU.js";import{x as k,y as A,U as B,V as D,B as v,F as L,o as N,n as S,q as V,s as q}from"./Footer-CeENDa52.js";import{N as z,S as T,M as $}from"./Navbar-CUWQJ0m4.js";import{C as G}from"./index-BL6UgPas.js";import{s as g}from"./index-DWr8MVPN.js";import"./Dropdown-DiFyNEDR.js";const W=()=>{const[w,y]=i.useState([]),[t,u]=i.useState(null),[n,r]=i.useState(null),[I,m]=i.useState(!1),[E,p]=i.useState(!1),F=k(),h=A(),C=F.currentUser;i.useEffect(()=>{C&&(async()=>{m(!0);try{const o=N(h,"users"),c=(await S(o)).docs.map(a=>({id:a.id,...a.data()}));c.sort((a,d)=>{const j=parseInt(a.room,10),f=parseInt(d.room,10);return j-f}),y(c)}catch(o){console.error("Error fetching users:",o),g.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้")}finally{m(!1)}})()},[C,h]);const M=e=>{(t==null?void 0:t.id)===e.id?(u(null),r(null)):(u(e),r({...e}),p(!0))},R=async()=>{if(n&&t){m(!0);try{const e=V(h,"users",t.id);await q(e,n),u(null),r(null),g.success("อัปเดตข้อมูลสำเร็จ");const o=N(h,"users"),c=(await S(o)).docs.map(a=>({id:a.id,...a.data()}));c.sort((a,d)=>{const j=parseInt(a.room,10),f=parseInt(d.room,10);return j-f}),y(c),p(!1)}catch(e){console.error("Error updating user:",e),g.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล")}finally{m(!1)}}},l=(e,o)=>{r(x=>x?{...x,[o]:e.target.value}:{})},b=()=>{p(!1),u(null),r(null)};return s.jsxs(s.Fragment,{children:[s.jsx(z,{}),s.jsxs("div",{className:"admin-container",children:[s.jsx("h2",{children:"จัดการข้อมูลผู้ใช้"}),I?s.jsx(T,{size:"large"}):s.jsx(s.Fragment,{children:s.jsx("div",{className:"user-list",children:s.jsx(B,{gutter:[16,8],children:w.map(e=>s.jsx(D,{span:12,children:s.jsx(G,{title:e.room,onClick:()=>M(e),hoverable:!0,className:`user-card ${(t==null?void 0:t.id)===e.id?"selected":""}`,children:s.jsx("p",{children:e.email})})},e.id))})})}),s.jsx($,{title:"ข้อมูลผู้ใช้",visible:E,onCancel:b,children:t&&s.jsxs("form",{children:[s.jsxs("label",{children:["ชื่อ:",s.jsx("input",{type:"text",className:"input-field",value:(n==null?void 0:n.name)||"",onChange:e=>l(e,"name")})]}),s.jsxs("label",{children:["ห้อง:",s.jsx("input",{type:"text",className:"input-field",value:(n==null?void 0:n.room)||"",onChange:e=>l(e,"room")})]}),s.jsxs("label",{children:["อีเมล:",s.jsx("input",{type:"text",className:"input-field",value:(n==null?void 0:n.email)||"",onChange:e=>l(e,"email")})]}),s.jsxs("label",{children:["เบอร์โทรศัพท์:",s.jsx("input",{type:"text",className:"input-field",value:(n==null?void 0:n.phone)||"",onChange:e=>l(e,"phone")})]}),s.jsxs("label",{children:["สัญญาเช่า:",s.jsx("input",{type:"text",className:"input-field",value:(n==null?void 0:n.rental)||"",onChange:e=>l(e,"rental")})]}),s.jsxs("label",{children:["ค่าเช่า:",s.jsx("input",{type:"number",className:"input-field",value:(n==null?void 0:n.Rent)||"",onChange:e=>l(e,"Rent")})]}),s.jsxs("label",{children:["ค่าน้ำ:",s.jsx("input",{type:"number",className:"input-field",value:(n==null?void 0:n.water)||"",onChange:e=>l(e,"water")})]}),s.jsxs("label",{children:["ค่าไฟ หน่วยละ:",s.jsx("input",{type:"number",className:"input-field",value:(n==null?void 0:n.electricity)||"",onChange:e=>l(e,"electricity")})]}),s.jsxs("label",{children:["สถานะห้อง:",s.jsxs("select",{className:"select-field",value:(n==null?void 0:n.roomStatus)||"occupied",onChange:e=>l(e,"roomStatus"),children:[s.jsx("option",{value:"available",children:"ว่าง"}),s.jsx("option",{value:"occupied",children:"ไม่ว่าง"})]})]}),s.jsxs("div",{style:{marginTop:"16px"},children:[s.jsx(v,{onClick:b,style:{marginRight:"8px"},children:"ยกเลิก"},"cancel"),s.jsx(v,{type:"primary",onClick:R,children:"อัปเดตข้อมูล"},"submit")]})]})})]}),s.jsx(L,{})]})};export{W as default};
