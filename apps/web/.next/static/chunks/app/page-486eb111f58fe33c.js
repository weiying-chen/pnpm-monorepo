(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{7017:function(e,t,s){Promise.resolve().then(s.bind(s,7823))},7823:function(e,t,s){"use strict";s.r(t);var r=s(1249),a=s(2925),i=s(338);let l=e=>{let{data:t,handleTagClick:s}=e;return(0,r.jsx)("div",{className:"mt-16 prompt_layout",children:t.map(e=>(0,r.jsx)(i.Z,{post:e,handleTagClick:s,handleEdit:()=>{},handleDelete:()=>{}},e._id))})};t.default=()=>{let[e,t]=(0,a.useState)(""),[s,i]=(0,a.useState)([]),[n,c]=(0,a.useState)([]);return(0,a.useEffect)(()=>{let e=async()=>{let e=await fetch("/api/prompt"),t=await e.json();i(t),c(t)};e()},[]),(0,r.jsxs)("section",{className:"feed",children:[(0,r.jsx)("form",{className:"relative w-full flex-center",children:(0,r.jsx)("input",{type:"text",placeholder:"Search for a prompt",value:null!=e?e:"",onChange:s=>{let r=s.target.value;t(s.target.value),console.log(r),i("#"!==e[0]?n.filter(e=>e.prompt.toLowerCase().includes(r)):n.filter(e=>e.tag.toLowerCase().includes(r)))},required:!0,className:"search_input peer"})}),(0,r.jsx)(l,{data:s,handleTagClick:e=>{t(e),i(n.filter(t=>t.tag.toLowerCase().includes(e)))}})]})}},338:function(e,t,s){"use strict";var r=s(1249),a=s(2925),i=s(7195),l=s.n(i),n=s(5619),c=s(7262),o=s(6588),d=s.n(o);t.Z=e=>{let{post:t,handleTagClick:s,handleEdit:i,handleDelete:o}=e,{data:u}=(0,n.useSession)(),p=(0,c.usePathname)(),[m,h]=(0,a.useState)("");return(0,r.jsxs)("div",{className:"prompt_card",children:[(0,r.jsxs)("div",{className:"flex justify-between items-start gap-5",children:[(0,r.jsx)("div",{className:"flex-1 flex justify-start items-center gap-3 cursor-pointer",children:(0,r.jsxs)(d(),{href:"/profile/".concat(t.creator._id),children:[(0,r.jsx)(l(),{src:t.creator.image,alt:"user_image",width:40,height:40,className:"rounded-full object-contain"}),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("h3",{className:"font-satoshi font-semibold text-gray-900",children:t.creator.username}),(0,r.jsx)("p",{className:"font-inter text-sm text-gray-500",children:t.creator.email})]})]})}),(0,r.jsx)("div",{className:"copy_btn",onClick:()=>{h(t.prompt),navigator.clipboard.writeText(t.prompt),setTimeout(()=>h(""),8e3)},children:(0,r.jsx)(l(),{src:m===t.prompt?"/assets/icons/tick.svg":"/assets/icons/copy.svg",width:12,height:12,alt:"copy_btn"})})]}),(0,r.jsx)("p",{className:"my-4 font-satoshi text-sm text-gray-700",children:t.prompt}),(0,r.jsx)("p",{className:"font-inter text-sm blue_gradient cursor-pointer",onClick:()=>{s&&s(t.tag)},children:t.tag}),(null==u?void 0:u.user)&&(null==u?void 0:u.user.id)===t.creator._id&&"/profile"===p&&(0,r.jsxs)("div",{className:"mt-5 flex-center gap-4 border-t border-gray-100 pt-3",children:[(0,r.jsx)("p",{className:"font-inter text-sm green_gradient cursor-pointer",onClick:i,children:"Edit"}),(0,r.jsx)("p",{className:"font-inter text-sm orange_gradient cursor-pointer",onClick:o,children:"Delete"})]})]})}},7262:function(e,t,s){e.exports=s(2312)}},function(e){e.O(0,[990,583,195,163,147,744],function(){return e(e.s=7017)}),_N_E=e.O()}]);