import{p as m,m as ee,ac as _,U as ne,d as B,f as W,c as te,ad as X,o as ae,Y as ie,u as E,r as le,ae as ce,$ as oe,C as re,af as se,ag as de,ah as he,ai as ue,L as me,aj as ge,q as c,N as Se,S as pe,a9 as fe,A as z,F as $e,t as Y,s as Ce,w as K,J as be,y as R,M as we,P as ve,Q as Ie,ab as ye}from"./index-D6uzPFSQ.js";import{F as y}from"./index-10YSMeNF.js";import{C as xe}from"./index-DvbpPlQ_.js";var ke=["prefixCls","className","checked","defaultChecked","disabled","loadingIcon","checkedChildren","unCheckedChildren","onClick","onChange","onKeyDown"],U=m.forwardRef(function(e,n){var o,i=e.prefixCls,s=i===void 0?"rc-switch":i,u=e.className,g=e.checked,l=e.defaultChecked,a=e.disabled,r=e.loadingIcon,h=e.checkedChildren,b=e.unCheckedChildren,p=e.onClick,C=e.onChange,k=e.onKeyDown,q=ee(e,ke),D=_(!1,{value:g,defaultValue:l}),M=ne(D,2),v=M[0],$=M[1];function F(f,N){var j=v;return a||(j=f,$(j),C==null||C(j,N)),j}function P(f){f.which===X.LEFT?F(!1,f):f.which===X.RIGHT&&F(!0,f),k==null||k(f)}function w(f){var N=F(!v,f);p==null||p(N,f)}var H=B(s,u,(o={},W(o,"".concat(s,"-checked"),v),W(o,"".concat(s,"-disabled"),a),o));return m.createElement("button",te({},q,{type:"button",role:"switch","aria-checked":v,disabled:a,className:H,ref:n,onKeyDown:P,onClick:w}),r,m.createElement("span",{className:"".concat(s,"-inner")},m.createElement("span",{className:"".concat(s,"-inner-checked")},h),m.createElement("span",{className:"".concat(s,"-inner-unchecked")},b)))});U.displayName="Switch";const Me=e=>{const{componentCls:n,trackHeightSM:o,trackPadding:i,trackMinWidthSM:s,innerMinMarginSM:u,innerMaxMarginSM:g,handleSizeSM:l,calc:a}=e,r=`${n}-inner`,h=E(a(l).add(a(i).mul(2)).equal()),b=E(a(g).mul(2).equal());return{[n]:{[`&${n}-small`]:{minWidth:s,height:o,lineHeight:E(o),[`${n}-inner`]:{paddingInlineStart:g,paddingInlineEnd:u,[`${r}-checked, ${r}-unchecked`]:{minHeight:o},[`${r}-checked`]:{marginInlineStart:`calc(-100% + ${h} - ${b})`,marginInlineEnd:`calc(100% - ${h} + ${b})`},[`${r}-unchecked`]:{marginTop:a(o).mul(-1).equal(),marginInlineStart:0,marginInlineEnd:0}},[`${n}-handle`]:{width:l,height:l},[`${n}-loading-icon`]:{top:a(a(l).sub(e.switchLoadingIconSize)).div(2).equal(),fontSize:e.switchLoadingIconSize},[`&${n}-checked`]:{[`${n}-inner`]:{paddingInlineStart:u,paddingInlineEnd:g,[`${r}-checked`]:{marginInlineStart:0,marginInlineEnd:0},[`${r}-unchecked`]:{marginInlineStart:`calc(100% - ${h} + ${b})`,marginInlineEnd:`calc(-100% + ${h} - ${b})`}},[`${n}-handle`]:{insetInlineStart:`calc(100% - ${E(a(l).add(i).equal())})`}},[`&:not(${n}-disabled):active`]:{[`&:not(${n}-checked) ${r}`]:{[`${r}-unchecked`]:{marginInlineStart:a(e.marginXXS).div(2).equal(),marginInlineEnd:a(e.marginXXS).mul(-1).div(2).equal()}},[`&${n}-checked ${r}`]:{[`${r}-checked`]:{marginInlineStart:a(e.marginXXS).mul(-1).div(2).equal(),marginInlineEnd:a(e.marginXXS).div(2).equal()}}}}}}},je=e=>{const{componentCls:n,handleSize:o,calc:i}=e;return{[n]:{[`${n}-loading-icon${e.iconCls}`]:{position:"relative",top:i(i(o).sub(e.fontSize)).div(2).equal(),color:e.switchLoadingIconColor,verticalAlign:"top"},[`&${n}-checked ${n}-loading-icon`]:{color:e.switchColor}}}},Ee=e=>{const{componentCls:n,trackPadding:o,handleBg:i,handleShadow:s,handleSize:u,calc:g}=e,l=`${n}-handle`;return{[n]:{[l]:{position:"absolute",top:o,insetInlineStart:o,width:u,height:u,transition:`all ${e.switchDuration} ease-in-out`,"&::before":{position:"absolute",top:0,insetInlineEnd:0,bottom:0,insetInlineStart:0,backgroundColor:i,borderRadius:g(u).div(2).equal(),boxShadow:s,transition:`all ${e.switchDuration} ease-in-out`,content:'""'}},[`&${n}-checked ${l}`]:{insetInlineStart:`calc(100% - ${E(g(u).add(o).equal())})`},[`&:not(${n}-disabled):active`]:{[`${l}::before`]:{insetInlineEnd:e.switchHandleActiveInset,insetInlineStart:0},[`&${n}-checked ${l}::before`]:{insetInlineEnd:0,insetInlineStart:e.switchHandleActiveInset}}}}},De=e=>{const{componentCls:n,trackHeight:o,trackPadding:i,innerMinMargin:s,innerMaxMargin:u,handleSize:g,calc:l}=e,a=`${n}-inner`,r=E(l(g).add(l(i).mul(2)).equal()),h=E(l(u).mul(2).equal());return{[n]:{[a]:{display:"block",overflow:"hidden",borderRadius:100,height:"100%",paddingInlineStart:u,paddingInlineEnd:s,transition:`padding-inline-start ${e.switchDuration} ease-in-out, padding-inline-end ${e.switchDuration} ease-in-out`,[`${a}-checked, ${a}-unchecked`]:{display:"block",color:e.colorTextLightSolid,fontSize:e.fontSizeSM,transition:`margin-inline-start ${e.switchDuration} ease-in-out, margin-inline-end ${e.switchDuration} ease-in-out`,pointerEvents:"none",minHeight:o},[`${a}-checked`]:{marginInlineStart:`calc(-100% + ${r} - ${h})`,marginInlineEnd:`calc(100% - ${r} + ${h})`},[`${a}-unchecked`]:{marginTop:l(o).mul(-1).equal(),marginInlineStart:0,marginInlineEnd:0}},[`&${n}-checked ${a}`]:{paddingInlineStart:s,paddingInlineEnd:u,[`${a}-checked`]:{marginInlineStart:0,marginInlineEnd:0},[`${a}-unchecked`]:{marginInlineStart:`calc(100% - ${r} + ${h})`,marginInlineEnd:`calc(-100% + ${r} - ${h})`}},[`&:not(${n}-disabled):active`]:{[`&:not(${n}-checked) ${a}`]:{[`${a}-unchecked`]:{marginInlineStart:l(i).mul(2).equal(),marginInlineEnd:l(i).mul(-1).mul(2).equal()}},[`&${n}-checked ${a}`]:{[`${a}-checked`]:{marginInlineStart:l(i).mul(-1).mul(2).equal(),marginInlineEnd:l(i).mul(2).equal()}}}}}},Fe=e=>{const{componentCls:n,trackHeight:o,trackMinWidth:i}=e;return{[n]:Object.assign(Object.assign(Object.assign(Object.assign({},le(e)),{position:"relative",display:"inline-block",boxSizing:"border-box",minWidth:i,height:o,lineHeight:E(o),verticalAlign:"middle",background:e.colorTextQuaternary,border:"0",borderRadius:100,cursor:"pointer",transition:`all ${e.motionDurationMid}`,userSelect:"none",[`&:hover:not(${n}-disabled)`]:{background:e.colorTextTertiary}}),ce(e)),{[`&${n}-checked`]:{background:e.switchColor,[`&:hover:not(${n}-disabled)`]:{background:e.colorPrimaryHover}},[`&${n}-loading, &${n}-disabled`]:{cursor:"not-allowed",opacity:e.switchDisabledOpacity,"*":{boxShadow:"none",cursor:"not-allowed"}},[`&${n}-rtl`]:{direction:"rtl"}})}},Ne=e=>{const{fontSize:n,lineHeight:o,controlHeight:i,colorWhite:s}=e,u=n*o,g=i/2,l=2,a=u-l*2,r=g-l*2;return{trackHeight:u,trackHeightSM:g,trackMinWidth:a*2+l*4,trackMinWidthSM:r*2+l*2,trackPadding:l,handleBg:s,handleSize:a,handleSizeSM:r,handleShadow:`0 2px 4px 0 ${new oe("#00230b").setAlpha(.2).toRgbString()}`,innerMinMargin:a/2,innerMaxMargin:a+l+l*2,innerMinMarginSM:r/2,innerMaxMarginSM:r+l+l*2}},ze=ae("Switch",e=>{const n=ie(e,{switchDuration:e.motionDurationMid,switchColor:e.colorPrimary,switchDisabledOpacity:e.opacityLoading,switchLoadingIconSize:e.calc(e.fontSizeIcon).mul(.75).equal(),switchLoadingIconColor:`rgba(0, 0, 0, ${e.opacityLoading})`,switchHandleActiveInset:"-30%"});return[Fe(n),De(n),Ee(n),je(n),Me(n)]},Ne);var qe=function(e,n){var o={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&n.indexOf(i)<0&&(o[i]=e[i]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,i=Object.getOwnPropertySymbols(e);s<i.length;s++)n.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(e,i[s])&&(o[i[s]]=e[i[s]]);return o};const Pe=m.forwardRef((e,n)=>{const{prefixCls:o,size:i,disabled:s,loading:u,className:g,rootClassName:l,style:a,checked:r,value:h,defaultChecked:b,defaultValue:p,onChange:C}=e,k=qe(e,["prefixCls","size","disabled","loading","className","rootClassName","style","checked","value","defaultChecked","defaultValue","onChange"]),[q,D]=_(!1,{value:r??h,defaultValue:b??p}),{getPrefixCls:M,direction:v,switch:$}=m.useContext(re),F=m.useContext(se),P=(s??F)||u,w=M("switch",o),H=m.createElement("div",{className:`${w}-handle`},u&&m.createElement(ue,{className:`${w}-loading-icon`})),[f,N,j]=ze(w),A=de(i),O=B($==null?void 0:$.className,{[`${w}-small`]:A==="small",[`${w}-loading`]:u,[`${w}-rtl`]:v==="rtl"},g,l,N,j),L=Object.assign(Object.assign({},$==null?void 0:$.style),a),T=function(){D(arguments.length<=0?void 0:arguments[0]),C==null||C.apply(void 0,arguments)};return f(m.createElement(he,{component:"Switch"},m.createElement(U,Object.assign({},k,{checked:q,onChange:T,prefixCls:w,className:O,style:L,disabled:P,ref:n,loadingIcon:H}))))}),Q=Pe;Q.__ANT_SWITCH=!0;const Ae=()=>{var T;const[e,n]=m.useState("มกราคม"),[o,i]=m.useState(new Date().getFullYear()),[s,u]=m.useState(!1),[g,l]=m.useState([]),[a,r]=m.useState(!0),[h,b]=m.useState(null),[p]=y.useForm(),[C,k]=m.useState({}),[q,D]=m.useState(0),[M,v]=m.useState(null),$=me(),F=ge();m.useEffect(()=>{(async()=>{r(!0);try{const d=Y($,"users"),x=(await Ce(d)).docs.map(I=>({id:I.id,...I.data()}));l(x)}catch(d){console.error("Error fetching users data: ",d)}finally{r(!1)}})()},[$]),m.useEffect(()=>{(async()=>{const d=o+543,S=`${e} ${d}`;try{const x=K($,"electricityData",S),I=await be(x);I.exists()?k(I.data()):(console.log("No electricity data found for the selected month and year."),k(P()))}catch(x){console.error("Error fetching electricity data: ",x)}})()},[e,o,$]);const P=()=>["201","202","203","204","205","206","207","208","309","310","311","312","313","314","315","316","225","226","227","228","329","330","331","332"].reduce((d,S)=>(d[S]={previous:"0",current:"0",units:"0",amount:"0"},d),{}),w=t=>{n(t.target.value)},H=t=>{i(Number(t.target.value))},f=()=>{u(!1),p.resetFields(),D(0),v(null)},N=t=>{var S;const d=(S=t.target.files)==null?void 0:S[0];d&&d.type==="application/pdf"?v(d):R.error("กรุณาเลือกไฟล์ PDF เท่านั้น")},j=async()=>{var t;try{let d="";if(M){const I=we(F,`invoices/${M.name}`);await ve(I,M),d=await Ie(I)}const S={userId:h.id,room:h.room||"ไม่ระบุ",month:e,year:o,rent:p.getFieldValue("rent"),water:p.getFieldValue("water"),electricity:((t=C[h.room])==null?void 0:t.amount)||"ไม่ระบุ",fine:p.getFieldValue("fine"),total:q,roomStatus:p.getFieldValue("roomStatus")?"จ่ายแล้ว":"ค้างชำระ",pdfUrl:d},x=K(Y($,"invoices"));await ye(x,S),R.success("บิลแจ้งหนี้ถูกส่งเรียบร้อยแล้ว!"),u(!1),p.resetFields(),D(0),v(null)}catch(d){console.error("Error saving invoice data: ",d),R.error("เกิดข้อผิดพลาดในการส่งบิลแจ้งหนี้")}},A=t=>{var d,S;b(t),p.setFieldsValue({room:t.room||"ไม่ระบุ",rent:t.rent||"",water:t.water||"",electricity:((d=C[t.room])==null?void 0:d.amount)||"ไม่ระบุ",fine:"",roomStatus:t.roomStatus||!1,total:`${O(t.rent,t.water,(S=C[t.room])==null?void 0:S.amount)}`}),u(!0)},O=(t,d,S,x="0")=>{const I=parseFloat(t||"0"),G=parseFloat(d||"0"),J=parseFloat(S||"0"),Z=parseFloat(x||"0"),V=I+G+J+Z;return D(V),p.setFieldsValue({total:`${V}`}),V},L=(t,d)=>{var S;O(d.rent,d.water,(S=C[h==null?void 0:h.room])==null?void 0:S.amount,d.fine)};return c.jsxs(c.Fragment,{children:[c.jsx(Se,{}),c.jsxs("div",{className:"invoice-form-container",children:[c.jsx("h3",{children:"เลือกรอบบิล"}),c.jsx("select",{className:"form-select","aria-label":"เลือกเดือน",value:e,onChange:w,children:["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"].map(t=>c.jsx("option",{value:t,children:t},t))}),c.jsx("select",{className:"form-select","aria-label":"เลือกปี",value:o,onChange:H,children:Array.from({length:10},(t,d)=>new Date().getFullYear()+d).map(t=>c.jsx("option",{value:t.toString(),children:t},t))}),a?c.jsx(pe,{size:"large"}):c.jsx("div",{className:"cards-container",children:g.map(t=>c.jsxs(xe,{title:`ห้อง: ${t.room||"ไม่ระบุ"}`,bordered:!0,style:{width:300,marginTop:16,cursor:"pointer"},onClick:()=>A(t),children:[c.jsxs("p",{children:["ชื่อ: ",t.name]}),c.jsxs("p",{children:["ค่าเช่า: ",t.rent]})]},t.id))})]}),c.jsx(fe,{title:`สร้างบิลสำหรับ ${h==null?void 0:h.name}`,visible:s,onCancel:f,footer:[c.jsx("button",{onClick:f,children:"ยกเลิก"},"back"),c.jsx("button",{onClick:j,children:"ส่งบิล"},"submit")],children:c.jsxs(y,{form:p,onValuesChange:L,children:[c.jsx(y.Item,{name:"room",label:"ห้อง",children:c.jsx(z,{disabled:!0})}),c.jsx(y.Item,{name:"rent",label:"ค่าเช่า",rules:[{required:!0,message:"กรุณากรอกค่าเช่า"}],children:c.jsx(z,{type:"number"})}),c.jsx(y.Item,{name:"water",label:"ค่าน้ำ",rules:[{required:!0,message:"กรุณากรอกค่าน้ำ"}],children:c.jsx(z,{type:"number"})}),c.jsx(y.Item,{name:"electricity",label:"ค่าไฟ",rules:[{required:!0,message:"กรุณากรอกค่าไฟ"}],children:c.jsx(z,{disabled:!0,value:((T=C[h==null?void 0:h.room])==null?void 0:T.amount)||"ไม่ระบุ"})}),c.jsx(y.Item,{name:"fine",label:"ค่าปรับ",children:c.jsx(z,{type:"number"})}),c.jsx(y.Item,{name:"total",label:"รวมทั้งหมด",children:c.jsx(z,{disabled:!0,value:q.toFixed(2)})}),c.jsx(y.Item,{name:"roomStatus",label:"สถานะการชำระเงิน",valuePropName:"checked",children:c.jsx(Q,{checkedChildren:"จ่ายแล้ว",unCheckedChildren:"ค้างชำระ"})}),c.jsx(y.Item,{label:"แนบไฟล์ PDF",children:c.jsx(z,{type:"file",accept:"application/pdf",onChange:N})})]})}),c.jsx($e,{})]})};export{Ae as default};
