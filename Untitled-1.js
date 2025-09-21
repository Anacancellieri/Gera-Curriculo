const form = document.getElementById("formCurriculo");
const out = document.getElementById("curriculoGerado");
const btnPdf = document.getElementById("baixarPdf");
const btnLimpar = document.getElementById("limparBtn");

/* Utilidades */
function textToListOrParagraph(raw){
  if(!raw) return "";
  // Normaliza quebras e remove linhas vazias nas pontas
  const lines = raw.replace(/\r/g,'').split('\n').map(s=>s.trim());
  const nonEmpty = lines.filter(Boolean);

  if(nonEmpty.length <= 1){
    // Texto corrido — também aceita separar por vírgula
    const asText = raw.includes(',') ? raw.split(',').map(s=>s.trim()).filter(Boolean).join(', ') : raw.trim();
    return `<p>${escapeHtml(asText)}</p>`;
  }

  // Múltiplas linhas -> lista
  const items = nonEmpty.map(li => `<li>${escapeHtml(li)}</li>`).join('');
  return `<ul>${items}</ul>`;
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

/* Geração do currículo */
form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value.trim();
  const endereço = document.getElementById("endereço").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const formacao = document.getElementById("formacao").value;
  const experiencia = document.getElementById("experiencia").value;
  const habilidades = document.getElementById("habilidades").value;

  const formacaoHtml = textToListOrParagraph(formacao);
  const experienciaHtml = textToListOrParagraph(experiencia);
  const habilidadesHtml = textToListOrParagraph(habilidades);

  out.innerHTML = `
    <h2>${escapeHtml(nome || "Seu Nome")}</h2>
    <p><strong>Idade:</strong> ${escapeHtml(idade)} anos</p>
    <p><strong>Endereço:</strong> ${escapeHtml(endereço)}</p>
    <p><strong>Telefone:</strong> ${escapeHtml(telefone)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>

    <p><strong>Formação</strong></p>
    ${formacaoHtml}

    <p><strong>Experiência Profissional</strong></p>
    ${experienciaHtml}

    <p><strong>Habilidades</strong></p>
    ${habilidadesHtml}
  `;

  out.style.display = "block";
  btnPdf.style.display = "block";
});

/* Limpar */
btnLimpar.addEventListener("click", ()=>{
  form.reset();
  out.innerHTML = "";
  out.style.display = "none";
  btnPdf.style.display = "none";
});

/* PDF via janela de impressão — com CSS embutido pra manter o layout */
btnPdf.addEventListener("click", ()=>{
  const conteudo = out.innerHTML;
  const w = window.open('', '', 'width=900,height=700');

  w.document.write(`
    <html>
      <head>
        <title>Currículo</title>
        <meta charset="UTF-8" />
        <style>
          @page { size: A4; margin: 18mm; }
          body{ font-family: "Poppins", Arial, sans-serif; color:#111827; }
          h2{ text-align:center; margin:0 0 12px; border-bottom:3px solid #a78bfa; display:inline-block; padding-bottom:6px; }
          p{ margin:8px 0; line-height:1.6; }
          ul{ margin: 6px 0 12px 1.1rem; }
          li{ margin:4px 0; }
          .header-band{
            height: 6px;
            background: linear-gradient(135deg, #b794f4, #60a5fa);
            border-radius: 6px;
            margin-bottom: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header-band"></div>
        ${conteudo}
      </body>
    </html>
  `);

  w.document.close();

  // Aguarda o reflow da nova aba para garantir que o conteúdo renderizou
  w.onload = ()=> w.print();
});



