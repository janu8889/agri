"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_STATE={bold:false,italic:false,underline:false,unordered:false,ordered:false,left:false,center:false,right:false,block:"p",size:"3"};

export default function RichTextEditor({value,onChange,label="Description and notes"}){
  const editor=useRef(null),selection=useRef(null),[active,setActive]=useState(DEFAULT_STATE);
  useEffect(()=>{if(editor.current&&document.activeElement!==editor.current&&editor.current.innerHTML!==(value||""))editor.current.innerHTML=value||""},[value]);
  const emit=()=>onChange(editor.current?.innerHTML||"");
  const updateToolbar=useCallback(()=>{const current=window.getSelection();if(!current?.rangeCount||!editor.current?.contains(current.anchorNode))return;const query=name=>{try{return document.queryCommandState(name)}catch{return false}},valueOf=name=>{try{return String(document.queryCommandValue(name)||"").toLowerCase()}catch{return ""}},rawBlock=valueOf("formatBlock").replace(/[<>]/g,""),rawSize=valueOf("fontSize");setActive({bold:query("bold"),italic:query("italic"),underline:query("underline"),unordered:query("insertUnorderedList"),ordered:query("insertOrderedList"),left:query("justifyLeft"),center:query("justifyCenter"),right:query("justifyRight"),block:["p","h1","h2","h3","blockquote"].includes(rawBlock)?rawBlock:"p",size:["2","3","5","6"].includes(rawSize)?rawSize:"3"})},[]);
  const saveSelection=useCallback(()=>{const current=window.getSelection();if(current?.rangeCount&&editor.current?.contains(current.anchorNode)){selection.current=current.getRangeAt(0).cloneRange();updateToolbar()}},[updateToolbar]);
  useEffect(()=>{document.addEventListener("selectionchange",saveSelection);return()=>document.removeEventListener("selectionchange",saveSelection)},[saveSelection]);
  const restoreSelection=()=>{editor.current?.focus();const current=window.getSelection();current.removeAllRanges();if(selection.current)current.addRange(selection.current);else if(editor.current){const range=document.createRange();range.selectNodeContents(editor.current);range.collapse(false);current.addRange(range)}};
  const command=(name,argument=null)=>{restoreSelection();document.execCommand(name,false,argument);saveSelection();emit()};
  return <div className="rich-editor overflow-hidden rounded-xl border border-zinc-300 bg-white focus-within:border-[#c9a227] focus-within:ring-2 focus-within:ring-amber-100">
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2" role="toolbar" aria-label={`${label} formatting`}>
      <Tool title="Bold" active={active.bold} onClick={()=>command("bold")}><b>B</b></Tool>
      <Tool title="Italic" active={active.italic} onClick={()=>command("italic")}><i>I</i></Tool>
      <Tool title="Underline" active={active.underline} onClick={()=>command("underline")}><u>U</u></Tool>
      <Divider/>
      <select aria-label="Text style" value={active.block} onChange={e=>command("formatBlock",e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs font-semibold">
        <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option>
      </select>
      <select aria-label="Text size" value={active.size} onChange={e=>command("fontSize",e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs font-semibold">
        <option value="2">Small</option><option value="3">Normal</option><option value="5">Large</option><option value="6">Extra large</option>
      </select>
      <Divider/>
      <Tool title="Bulleted list" active={active.unordered} onClick={()=>command("insertUnorderedList")}>• List</Tool>
      <Tool title="Numbered list" active={active.ordered} onClick={()=>command("insertOrderedList")}>1. List</Tool>
      <Tool title="Align left" active={active.left} onClick={()=>command("justifyLeft")}>≡</Tool>
      <Tool title="Align center" active={active.center} onClick={()=>command("justifyCenter")}>≡̅</Tool>
      <Tool title="Align right" active={active.right} onClick={()=>command("justifyRight")}>≡›</Tool>
      <Divider/>
      <Tool title="Undo" onClick={()=>command("undo")}>↶</Tool>
      <Tool title="Redo" onClick={()=>command("redo")}>↷</Tool>
      <Tool title="Clear formatting" onClick={()=>command("removeFormat")}>Clear</Tool>
    </div>
    <div ref={editor} contentEditable suppressContentEditableWarning role="textbox" aria-label={label} aria-multiline="true" onFocus={saveSelection} onInput={()=>{saveSelection();emit()}} onKeyUp={saveSelection} onMouseUp={saveSelection} onBlur={()=>{saveSelection();emit()}} onPaste={e=>{e.preventDefault();restoreSelection();document.execCommand("insertText",false,e.clipboardData.getData("text/plain"));saveSelection();emit()}} data-placeholder="Adjustments, included attachments, condition notes, etc." className="rich-editor__surface min-h-40 p-4 text-sm leading-6 outline-none"/>
  </div>
}

function Tool({title,onClick,active=false,children}){return <button type="button" title={title} aria-label={title} aria-pressed={active} onMouseDown={e=>e.preventDefault()} onClick={onClick} className={`min-w-9 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${active?"border-[#c9a227] bg-amber-100 text-amber-950 shadow-inner":"border-transparent text-zinc-700 hover:border-zinc-300 hover:bg-white"}`}>{children}</button>}
function Divider(){return <span aria-hidden="true" className="mx-1 h-6 w-px bg-zinc-300"/>}
