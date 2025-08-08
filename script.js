document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (burger) burger.addEventListener('click', () => menu.classList.toggle('open'));
});

const Lightbox = (() => {
  let state = { items: [], index: 0 };
  const el = { root:null,img:null,cap:null,prev:null,next:null,close:null };

  function build(){
    el.root=document.createElement('div'); el.root.className='lightbox';
    el.img=document.createElement('img'); el.cap=document.createElement('div'); el.cap.className='caption';
    el.prev=document.createElement('button'); el.prev.className='prev'; el.prev.textContent='‹';
    el.next=document.createElement('button'); el.next.className='next'; el.next.textContent='›';
    el.close=document.createElement('button'); el.close.className='close'; el.close.textContent='✕';
    el.root.append(el.img,el.cap,el.prev,el.next,el.close); document.body.appendChild(el.root);

    el.close.onclick=()=>el.root.classList.remove('open');
    el.prev.onclick=()=>show(state.index-1);
    el.next.onclick=()=>show(state.index+1);

    document.addEventListener('keydown',e=>{
      if(!el.root.classList.contains('open')) return;
      if(e.key==='Escape') el.root.classList.remove('open');
      if(e.key==='ArrowLeft') show(state.index-1);
      if(e.key==='ArrowRight') show(state.index+1);
    });
  }

  function open(items,index){
    state.items=items; state.index=index;
    show(index);
    el.root.classList.add('open');
  }

  function show(i){
    if(state.items.length===0) return;
    state.index=(i+state.items.length)%state.items.length;
    const item=state.items[state.index];
    el.img.src=`images/${item.src}`;
    el.cap.textContent=`${item.title} (${item.year}) - ${item.medium} ${item.size}`;
  }

  return { build, open };
})();

fetch('images/images.json')
  .then(res=>res.json())
  .then(images=>{
    const grid=document.querySelector('.gallery-grid');
    if(grid){
      images.forEach((img,idx)=>{
        const el=document.createElement('img');
        el.src=`images/${img.src}`;
        el.alt=img.alt;
        el.onclick=()=>Lightbox.open(images,idx);
        grid.appendChild(el);
      });
    }
    Lightbox.build();
  });
