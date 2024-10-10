import{p as a,q as e,N as x,F as j,s as m,t as p,v as i,a9 as g,w as u}from"./index-D0hLmu_5.js";function y(){const[r,c]=a.useState([]),[d,n]=a.useState(!0);a.useEffect(()=>{(async()=>{n(!0);try{const h=(await m(p(i,"parcels"))).docs.map(l=>({id:l.id,...l.data()}));c(h)}catch(t){console.error("Error fetching parcels:",t)}finally{n(!1)}})()},[]);const o=async s=>{if(window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?"))try{await g(u(i,"parcels",s)),c(r.filter(t=>t.id!==s)),alert("ลบข้อมูลสำเร็จ")}catch(t){console.error("Error deleting parcel:",t),alert("เกิดข้อผิดพลาดในการลบข้อมูล")}};return e.jsxs(e.Fragment,{children:[e.jsx(x,{}),e.jsxs("div",{className:"admin-parcel-page",children:[e.jsx("h2",{children:"ลบประวัติรับพัสดุ"}),d?e.jsx("p",{children:"กำลังโหลดข้อมูล..."}):r.length===0?e.jsx("p",{children:"ไม่มีข้อมูลพัสดุที่บันทึกไว้"}):e.jsxs("table",{className:"parcel-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ผู้รับ"}),e.jsx("th",{children:"เลขพัสดุ"}),e.jsx("th",{children:"ประเภทพัสดุ"}),e.jsx("th",{children:"รูปภาพ"}),e.jsx("th",{children:"วันที่ส่ง"}),e.jsx("th",{children:"ลบข้อมูล"})]})}),e.jsx("tbody",{children:r.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:s.recipient}),e.jsx("td",{children:s.trackingNumber}),e.jsx("td",{children:s.parcelType.join(", ")}),e.jsx("td",{children:e.jsx("img",{src:s.imageUrl,alt:"รูปพัสดุ",className:"parcel-image"})}),e.jsx("td",{children:new Date(s.timestamp.seconds*1e3).toLocaleString()}),e.jsx("td",{children:e.jsx("button",{onClick:()=>o(s.id),className:"delete-button",children:"ลบ"})})]},s.id))})]})]}),e.jsx(j,{})]})}export{y as default};
