import{r as a,j as e}from"./index-CUqas5L9.js";import{F as S,z as w,A as y,D as E,E as F,G as x,o as j,p as b}from"./Footer-CyUfZN7b.js";import{N,S as R}from"./Navbar-CHTzMUP0.js";import{s as r}from"./index-BdC4Iwiu.js";function z(){const[o,l]=a.useState(""),[c,m]=a.useState(""),[i,u]=a.useState(null),[d,p]=a.useState(!1),[D,g]=a.useState(!1),v=async t=>{t.preventDefault();const n=o.trim(),f=c.trim();if(!n||!f){r.warning("กรุณากรอกข้อมูลให้ครบถ้วน");return}p(!0),g(!0);try{let s="";if(i){const h=w(y,`maintenance/${i.name}`);await E(h,i),s=await F(h)}await x(j(b,"maintenanceReports"),{issueDescription:n,location:f,imageUrl:s,timestamp:new Date}),await x(j(b,"notifications"),{userId:"adminUserId",message:`แจ้งรายการแซ่มแซม: ${n}`,timestamp:new Date}),r.success("บันทึกข้อมูลสำเร็จ"),l(""),m(""),u(null),document.getElementById("imageInput").value=""}catch(s){console.error("Error saving maintenance report:",s),r.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล")}finally{p(!1),g(!1)}},I=t=>{t.target.files&&t.target.files[0]&&u(t.target.files[0])};return e.jsxs("div",{className:"wrapper",children:[e.jsx(N,{}),D&&e.jsx("div",{className:"loading-container",children:e.jsx(R,{size:"large"})}),e.jsx("h3",{children:"แจ้งซ่อมแซม"}),e.jsxs("form",{onSubmit:v,className:"maintenance-form",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"issueDescription",children:"รายละเอียดปัญหา :"}),e.jsx("textarea",{id:"issueDescription",value:o,onChange:t=>l(t.target.value),required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"location",children:"สถานที่ :"}),e.jsx("input",{id:"location",type:"text",value:c,onChange:t=>m(t.target.value),required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"imageInput",children:"รูปภาพปัญหา (ถ้ามี):"}),e.jsx("input",{id:"imageInput",type:"file",accept:"image/*",onChange:I})]}),e.jsx("button",{type:"submit",disabled:d,children:d?"กำลังบันทึก...":"บันทึก"})]}),e.jsx(S,{})]})}export{z as default};
