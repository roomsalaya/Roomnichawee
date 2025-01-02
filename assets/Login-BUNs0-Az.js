import{r as o,u as j,j as e}from"./index-CIgUH_ON.js";import{I as f,_ as g,B as v,F as I,s as S,a as c,d as b,b as E,g as F}from"./Footer-Dm_9wlKh.js";import{F as a}from"./index-_AL-L4r3.js";import{I as h}from"./index-D5WSpubm.js";import{C as y}from"./index-BOzfgrDM.js";import{s as l}from"./index-DbF_Bpw-.js";import"./EyeOutlined-BWV4nvJ0.js";var O={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"}}]},name:"lock",theme:"outlined"},k=function(t,s){return o.createElement(f,g({},t,{ref:s,icon:O}))},V=o.forwardRef(k),z={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"}}]},name:"user",theme:"outlined"},C=function(t,s){return o.createElement(f,g({},t,{ref:s,icon:z}))},M=o.forwardRef(C);const U=()=>{const[n,t]=o.useState(!1),[s]=a.useForm(),m=j();o.useEffect(()=>{const r=localStorage.getItem("email"),i=localStorage.getItem("password");r&&s.setFieldsValue({email:r}),i&&s.setFieldsValue({password:i})},[s]);const p=async r=>{t(!0),console.log("Email:",r.email),console.log("Password:",r.password);try{const x=(await S(c,r.email,r.password)).user,w=b(E,"users",x.uid),d=await F(w);if(d.exists()){const u=d.data();r.remember?(localStorage.setItem("email",r.email),localStorage.setItem("password",r.password)):(localStorage.removeItem("email"),localStorage.removeItem("password")),u.role==="admin"?m("/admindashboard"):u.role==="user"?m("/Profile"):(l.error("บทบาทของผู้ใช้ไม่ถูกต้อง"),await c.signOut())}else l.error("ไม่พบข้อมูลผู้ใช้ในระบบ"),await c.signOut()}catch(i){console.error("Error during sign-in:",i),l.error("การล็อกอินล้มเหลว กรุณาตรวจสอบข้อมูลประจำตัวของคุณ.")}finally{t(!1)}};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"login-container",children:[e.jsx("h2",{children:"ล็อกอิน"}),e.jsxs(a,{form:s,name:"login",initialValues:{remember:!0},onFinish:p,children:[e.jsx(a.Item,{name:"email",rules:[{required:!0,message:"กรุณากรอกอีเมลของคุณ!"}],children:e.jsx(h,{prefix:e.jsx(M,{}),placeholder:"อีเมล",type:"email"})}),e.jsx(a.Item,{name:"password",rules:[{required:!0,message:"กรุณากรอกรหัสผ่านของคุณ!"}],children:e.jsx(h.Password,{prefix:e.jsx(V,{}),placeholder:"รหัสผ่าน"})}),e.jsx(a.Item,{children:e.jsx(a.Item,{name:"remember",valuePropName:"checked",noStyle:!0,children:e.jsx(y,{children:"จำรหัสผ่าน"})})}),e.jsx(a.Item,{children:e.jsx(v,{type:"primary",htmlType:"submit",loading:n,block:!0,children:"ล็อกอิน"})})]})]}),e.jsx(I,{})]})};export{U as default};
