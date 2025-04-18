const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

//Bouton filtre actif 
const buttons = document.querySelectorAll('.btn-filtre');

buttons.forEach(btn => {
  btn.addEventListener('click', (event) => {
    const target = event.target.value
    document.querySelector(".gallery").innerHTML = ""
    if(target === ''){
      genererProjets(projets)
     } else {
      const filtres = projets.filter( (projet) => {
        return projet.categoryId === Number(target)
      })
      genererProjets(filtres)
    }
    buttons.forEach(b => b.classList.remove('active')); 
    btn.classList.add('active');
  });
});

//Fontion globale//
function genererProjets(Allprojets){
    for(let i = 0; i < Allprojets.length; i++) {
        const article = Allprojets[i]
        const gallery = document.querySelector(".gallery");
        const projetElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl
        const captionElement = document.createElement("figcaption")
        captionElement.innerText = article.title
        const categoryElementName = article.category.name
        const categoryElementID = article.category.id
        projetElement.setAttribute("id", categoryElementID)
        gallery.appendChild(projetElement)
        projetElement.appendChild(imageElement)
        projetElement.appendChild(captionElement)
    }
}
genererProjets(projets)

