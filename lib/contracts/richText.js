const ALLOWED_TAGS = new Set(["p","div","br","strong","b","em","i","u","h1","h2","h3","ul","ol","li","blockquote","span","font"]);
const BLOCK_TAGS = new Set(["p","div","h1","h2","h3","li","blockquote"]);

export function sanitizeRichTextHtml(value, maxLength = 12000) {
  let html=String(value||"").slice(0,maxLength);
  html=html.replace(/<!--[^]*?-->/g,"").replace(/<(script|style|iframe|object|embed|svg|math)[^>]*>[^]*?<\/\1\s*>/gi,"");
  return html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi,(match,rawTag,rawAttrs)=>{
    const tag=rawTag.toLowerCase();
    if(!ALLOWED_TAGS.has(tag))return "";
    if(match.startsWith("</"))return tag==="br"?"":`</${tag}>`;
    if(tag==="br")return "<br>";
    if(tag==="font"){
      const size=rawAttrs.match(/\bsize\s*=\s*["']?([1-7])/i)?.[1];
      return size?`<font size="${size}">`:"<font>";
    }
    const align=rawAttrs.match(/(?:text-align\s*:\s*|\balign\s*=\s*["']?)(left|center|right|justify)/i)?.[1]?.toLowerCase();
    return align?`<${tag} style="text-align:${align}">`:`<${tag}>`;
  }).trim();
}

export function richTextToPlainText(value) {
  return decodeEntities(sanitizeRichTextHtml(value)
    .replace(/<li(?:\s[^>]*)?>/gi,"• ")
    .replace(/<br\s*\/?>/gi,"\n")
    .replace(/<\/(?:p|div|h1|h2|h3|li|blockquote)>/gi,"\n")
    .replace(/<[^>]+>/g,""))
    .replace(/\u00a0/g," ").replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").trim();
}

export function plainTextToRichHtml(value) {
  return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r?\n/g,"<br>");
}

export function richTextBlocks(value) {
  const html=sanitizeRichTextHtml(value),tokens=html.match(/<[^>]+>|[^<]+/g)||[],blocks=[];
  let block={type:"p",align:"left",runs:[]},bold=0,italic=0,underline=0,size=3,list="",listIndex=0;
  const push=()=>{if(block.runs.some(run=>run.text)){blocks.push(block);block={type:"p",align:"left",runs:[]}}};
  for(const token of tokens){
    if(!token.startsWith("<")){const text=decodeEntities(token).replace(/\u00a0/g," ");if(text)block.runs.push({text,bold:bold>0,italic:italic>0,underline:underline>0,size});continue}
    const closing=/^<\//.test(token),tag=token.match(/^<\/?\s*([a-z0-9]+)/i)?.[1]?.toLowerCase();if(!tag)continue;
    if(tag==="br"&&!closing){block.runs.push({text:"\n",bold:bold>0,italic:italic>0,underline:underline>0,size});continue}
    if(["p","div","h1","h2","h3","blockquote","li"].includes(tag)){
      if(!closing){push();block.type=tag;block.align=token.match(/text-align:(left|center|right|justify)/i)?.[1]||"left";if(tag==="li"){block.list=list;block.listIndex=list==="ol"?++listIndex:0}}
      else push();
    }
    if(tag==="ul"||tag==="ol"){if(!closing){list=tag;listIndex=0}else list=""}
    if(tag==="strong"||tag==="b")bold+=closing?-1:1;
    if(tag==="em"||tag==="i")italic+=closing?-1:1;
    if(tag==="u")underline+=closing?-1:1;
    if(tag==="font"){if(closing)size=3;else size=Number(token.match(/size="([1-7])"/)?.[1]||3)}
    bold=Math.max(0,bold);italic=Math.max(0,italic);underline=Math.max(0,underline);
  }
  push();return blocks;
}

function decodeEntities(value){return String(value).replace(/&nbsp;/gi,"\u00a0").replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Math.min(1114111,Number(n))))}

export function hasRichText(value){return richTextToPlainText(value).length>0}
