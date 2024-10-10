import{p as r,q as e,N as w,S as v,ab as l,aa as D,G as j,F as b,s as E,t as $,v as d,y as i,a9 as C,w as g,x as L}from"./index-D0hLmu_5.js";const I=()=>{const[c,o]=r.useState([]),[f,u]=r.useState(!0),[y,h]=r.useState(!1),[s,p]=r.useState(null);r.useEffect(()=>{(async()=>{u(!0);try{const n=(await E($(d,"maintenanceReports"))).docs.map(m=>({id:m.id,...m.data()}));o(n)}catch(a){console.error("Error fetching maintenance reports:",a),i.error("เกิดข้อผิดพลาดในการดึงข้อมูล")}finally{u(!1)}})()},[]);const S=t=>{p(t),h(!0)},x=()=>{h(!1),p(null)},M=async t=>{try{await C(g(d,"maintenanceReports",t)),i.success("ลบรายการเรียบร้อย"),o(c.filter(a=>a.id!==t))}catch(a){console.error("Error deleting report:",a),i.error("เกิดข้อผิดพลาดในการลบรายการ")}finally{x()}},R=async t=>{if(!s)return;const a=s.status==="ซ่อมแซมแล้ว"?"รอดำเนินการ":"ซ่อมแซมแล้ว";try{await L(g(d,"maintenanceReports",t),{status:a}),i.success("อัปเดตสถานะเรียบร้อย"),o(c.map(n=>n.id===t?{...n,status:a}:n))}catch(n){console.error("Error updating status:",n),i.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ")}};return e.jsxs("div",{className:"maintenance-list-wrapper",children:[" ",e.jsx(w,{}),e.jsxs("div",{className:"maintenance-list-container",children:[e.jsx("h3",{children:"รายการแจ้งซ่อมแซม"}),f?e.jsx("div",{className:"loading-container",children:e.jsx(v,{size:"large"})}):e.jsx(l,{itemLayout:"vertical",size:"large",dataSource:c,renderItem:t=>e.jsxs(l.Item,{onClick:()=>S(t),style:{cursor:"pointer"},children:[e.jsx(l.Item.Meta,{title:`สถานที่: ${t.location}`}),e.jsx("p",{children:`รายละเอียด: ${t.issueDescription}`})]},t.id)})]}),e.jsx(D,{title:`รายละเอียดการแจ้งซ่อม: ${s==null?void 0:s.location}`,visible:y,onCancel:x,footer:null,children:s&&e.jsxs(e.Fragment,{children:[e.jsx("p",{children:`รายละเอียด: ${s.issueDescription}`}),s.imageUrl&&e.jsx("img",{src:s.imageUrl,alt:"ปัญหา",style:{maxWidth:"100%",maxHeight:"300px"}}),e.jsx("p",{children:`วันที่แจ้ง: ${new Date(s.timestamp.seconds*1e3).toLocaleString()}`}),e.jsx("p",{children:`สถานะ: ${s.status||"ยังไม่ได้ระบุ"}`}),e.jsx(j,{onClick:()=>R(s.id),style:{marginRight:"10px"},children:s.status==="ซ่อมแซมแล้ว"?"เปลี่ยนเป็นรอดำเนินการ":"เปลี่ยนเป็นซ่อมแซมแล้ว"}),e.jsx(j,{danger:!0,onClick:()=>M(s.id),children:"ลบรายการ"})]})}),e.jsx(b,{})]})};export{I as default};
