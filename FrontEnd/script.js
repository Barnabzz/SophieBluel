//fetch depuis le backEnd//
let projets = []
  const response = await fetch('http://localhost:5678/api/works');
  projets = await response.json();
  genererProjets(projets);  
 
  function fetchEtAfficherProjets() {
    fetch("http://localhost:5678/api/works")
      .then(res => res.json())
      .then(data => {
        projets = data;
        genererProjets(projets);
      });
  }
  
  checkToken()



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

//Fontion gallery//
function genererProjets(Allprojets){
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML= ""
    for(let i = 0; i < Allprojets.length; i++) {
        const article = Allprojets[i]
        const gallery = document.querySelector(".gallery");
        const projetElement = document.createElement("figure");

        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        
        const overlay = document.createElement("div");
        overlay.className = "image-overlay";
        
        const titreOverlay = document.createElement("span");
        titreOverlay.className = "overlay-title";
        titreOverlay.textContent = article.title;
        
        overlay.appendChild(titreOverlay);
        imageContainer.appendChild(imageElement);
        imageContainer.appendChild(overlay);
       
        const captionElement = document.createElement("figcaption");
        captionElement.className = "caption";
        captionElement.innerText = article.title;
        
        projetElement.appendChild(imageContainer);
        projetElement.appendChild(captionElement);
        gallery.appendChild(projetElement);
        
    }
}
///Check du token 
function checkToken() {
  const token = localStorage.getItem("token");
  if (token) {
    adminEdition();
  } else {
  }
}

function removeToken() {
  localStorage.removeItem("token");
}

//Admin Edition 
function adminEdition() {
  document.body.classList.add("margintop");
  const bandeauNoir = document.createElement("div")
  bandeauNoir.classList.add("rectangleModifier")
  document
  .querySelector("body")
  .insertAdjacentElement("afterbegin", bandeauNoir);
  const spanBandeauNoir = document.createElement("span")
  spanBandeauNoir.textContent = "Mode édition"
  spanBandeauNoir.id = "spanbandeau"
  const iconeBandeauNoir = document.createElement("i")
  iconeBandeauNoir.className = "fa-solid fa-pen-to-square"
  spanBandeauNoir.insertBefore(iconeBandeauNoir, spanBandeauNoir.firstChild)
  bandeauNoir.appendChild(spanBandeauNoir)
  const filtres = document.querySelector(".filter")
  filtres.classList.add("none")
  const MesProjets = document.querySelector(".MesProjets")
  const btnModifier = document.createElement("button")
  const spanBtnModifier = document.createElement("span")
  const iconeBtnModifier = document.createElement("i")
  iconeBtnModifier.className = "fa-solid fa-pen-to-square"
  btnModifier.classList.add("btnModifier")
  btnModifier.type = "button"
  spanBtnModifier.id = "spanBtnModifier"
  spanBtnModifier.textContent = "modifier"
  spanBtnModifier.insertBefore(iconeBtnModifier, spanBtnModifier.firstChild)
  MesProjets.appendChild(btnModifier)
  btnModifier.appendChild(spanBtnModifier)

  //Changement en logOut dans le header + activation du bouton 
  const loginOut = document.querySelector(".loginOut")
  loginOut.textContent = "log out";
  loginOut.href = "/index.html";
  loginOut.addEventListener("click", () => {
    removeToken()
  })
}

//MODALE

//Clic ==> Création modale
const btnModale = document.querySelector(".btnModifier")
btnModale.addEventListener("click", () => {
  createModal();
  openModal()
})

//Prévention plusieurs affichages de modale
let modal = null;
let modalOverlay = null;

//Création modale
function createModal() {
  if (modalOverlay) {
    modalOverlay.remove();
  }
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'overlay';
  modalOverlay.style.display = 'flex';
  modalOverlay.addEventListener('click', handleOverlayClick);

  modal = document.createElement('div');
  modal.className = 'modal';

  function genererPage1Modal() {
    modal.innerHTML = ""
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeModal;

    const titreModale = document.createElement("h3");
    titreModale.textContent = "Galerie photo"

    const galleryModale = document.createElement("div")
    galleryModale.classList.add("galleryModale")

    modal.appendChild(closeButton);
    modal.appendChild(titreModale);
    modalOverlay.appendChild(modal);
    modal.appendChild(galleryModale)
    document.body.appendChild(modalOverlay);


    function genererProjetsModale(Allprojets){
      for(let i = 0; i < Allprojets.length; i++) {
          const article = Allprojets[i]
          const galleryModale = document.querySelector(".galleryModale");
          const projetElement = document.createElement("div");
          const imageElement = document.createElement("img");
          const btnPoubelle = document.createElement("button")
          btnPoubelle.type = "button"
          btnPoubelle.classList.add("btnPoubelle")
          btnPoubelle.id = `btn-poubelle-${article.id}`;
          const poubelle = document.createElement("i")
          poubelle.classList.add("fa-solid", "fa-trash-can", "poubelle");
          imageElement.src = article.imageUrl
          projetElement.id = "divPhoto"
          galleryModale.appendChild(projetElement)
          projetElement.appendChild(imageElement)
          projetElement.appendChild(btnPoubelle)
          btnPoubelle.appendChild(poubelle)
          btnPoubelle.addEventListener("click", function () {
            if (confirm("Supprimer ce projet ?")) {
              supprimerProjet(article.id, projetElement);
            }
          });
      }
    }
    function supprimerProjet(id, element) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté.");
        return;
      }
    
      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) {
          element.remove(); 
        } else {
          alert("Erreur lors de la suppression");
        }
      })
      .catch(err => {
        console.error("Erreur réseau :", err);
      });
    }
    genererProjetsModale(projets)
    const footerModale = document.createElement("div")
    footerModale.id = "footerModale"
    const barreGrise = document.createElement("hr")
    const btnAjouterPhoto = document.createElement("button")
    btnAjouterPhoto.type = "button"
    btnAjouterPhoto.textContent = "Ajouter une photo"
    btnAjouterPhoto.className = "btnAjouterPhoto"
    modal.appendChild(footerModale)
    footerModale.appendChild(barreGrise)
    footerModale.appendChild(btnAjouterPhoto)

    btnAjouterPhoto.addEventListener("click", () => {
      modal.innerHTML = ""
      createformModale()
    })
    
  }
  genererPage1Modal()

  
  function createformModale() {
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeModal;
    const fleche = document.createElement("button")
    fleche.innerHTML = '&larr;';
    fleche.classList.add("flecheretour")
    modal.appendChild(closeButton)
    modal.appendChild(fleche)
    const titreFormModale = document.createElement("h3")
    titreFormModale.textContent = "Ajout photo"
    titreFormModale.id = "titreFormModale"
    modal.appendChild(titreFormModale)
    const formAjout = document.createElement("form");
    formAjout.className = "form-ajout-photo";
  
    // Ajout de la photo
    const divLabel = document.createElement("div");
    divLabel.className = "upload-zone";
  
    const label = document.createElement("label");
    label.htmlFor = "image-upload";
    label.className = "upload-label";
  
    const previewContainer = document.createElement("div");
    previewContainer.className = "upload-preview-container";
  
    const imagePreview = document.createElement("img");
    imagePreview.id = "preview-image";
    imagePreview.className = "upload-preview";
    imagePreview.style.display = "none";
  
    const iconeImage = document.createElement("i");
    iconeImage.className = "fa-solid fa-image upload-icon";
  
    const spanPhoto = document.createElement("span");
    spanPhoto.className = "upload-button";
    spanPhoto.textContent = "+ Ajouter photo";
  
    const inputhidden = document.createElement("input");
    inputhidden.type = "file";
    inputhidden.id = "image-upload";
    inputhidden.accept = "image/png, image/jpeg";
    inputhidden.hidden = true;
  
    const texteSpecs = document.createElement("p");
    texteSpecs.className = "upload-hint";
    texteSpecs.textContent = "jpg, png : 4mo max";
  
    // --- Champs titre et catégorie ---
    const labelTitre = document.createElement("label")
    labelTitre.htmlFor = "titre-input"
    labelTitre.textContent = "Titre"
    labelTitre.id = "labelTitre"
    const inputTitre = document.createElement("input");
    inputTitre.type = "text";
    inputTitre.name = "titre";
    inputTitre.className = "form-input";
    inputTitre.id = "titre-input"
    const labelCategorie = document.createElement("label")
    labelCategorie.textContent = "Catégorie :"
    labelCategorie.htmlFor = "categorie-input"
    labelCategorie.id = "labelCategorie"
    const selectCategorie = document.createElement("select");
    selectCategorie.name = "";
    selectCategorie.className = "form-input";
    selectCategorie.id = "categorie-input"
  
    const optionVide = document.createElement("option");
    optionVide.value = "";
    optionVide.textContent = "";
    selectCategorie.appendChild(optionVide);
  
    // Appel API pour charger les catégories
    fetch("http://localhost:5678/api/categories")
      .then(res => res.json())
      .then(categories => {
        categories.forEach(cat => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.name;
          selectCategorie.appendChild(option);
        });
      });
  
    //  Bouton valider 
    const barreGrise = document.createElement("hr");
    barreGrise.className = "form-divider";
    const boutonValider = document.createElement("button");
    boutonValider.type = "submit";
    boutonValider.className = "form-submit";
    boutonValider.textContent = "Valider";
    boutonValider.disabled = true;
  
    // Ajouts dans le DOM
    modal.appendChild(formAjout);
    formAjout.appendChild(divLabel);
    divLabel.appendChild(label);
    label.appendChild(previewContainer);
    previewContainer.appendChild(imagePreview);
    previewContainer.appendChild(iconeImage);
    label.appendChild(spanPhoto);
    divLabel.appendChild(inputhidden);
    divLabel.appendChild(texteSpecs);
    formAjout.appendChild(labelTitre);
    formAjout.appendChild(inputTitre);
    formAjout.appendChild(labelCategorie)
    formAjout.appendChild(selectCategorie);
    formAjout.appendChild(barreGrise)
    formAjout.appendChild(boutonValider);
    
  
    //  Prévisualisation de l'image 
    inputhidden.addEventListener("change", function () {
      const file = inputhidden.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
          iconeImage.style.display = "none";
          spanPhoto.textContent = "Changer photo"
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = "";
        imagePreview.style.display = "none";
        iconeImage.style.display = "block";
      }
      verifierFormulaire();
    });
  
    //  Activation du bouton valider 
    function verifierFormulaire() {
      const rempli = inputTitre.value.trim() !== "" &&
                    selectCategorie.value !== "" &&
                    inputhidden.files.length > 0;
      boutonValider.disabled = !rempli;
      boutonValider.classList.toggle("active", rempli);
    }
  
    document.addEventListener("input", verifierFormulaire);
    document.addEventListener("change", verifierFormulaire);
  
    //  Soumission du formulaire 
    formAjout.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("title", inputTitre.value);
      formData.append("category", selectCategorie.value);
      formData.append("image", inputhidden.files[0]);
  
      const token = localStorage.getItem("token")
      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
      .then(res => {
        if (res.ok) {
          alert("Projet ajouté !")
          closeModal()
          genererProjets(projets)
        } else {
          alert("Erreur lors de l'envoi.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Erreur réseau.");
      });
    });

    fleche.addEventListener("click", () => {
    modal.innerHTML=""
    genererPage1Modal()
  })
  }

}



// Ouverture Modale
function openModal() {
    createModal();
    document.body.classList.add('modal-open')
    fetchEtAfficherProjets()
  }


//Fermeture de la modale
function closeModal() {
  if (modalOverlay) {
    modalOverlay.remove();
    modalOverlay = null;   
    document.body.classList.remove('modal-open');
    fetchEtAfficherProjets()
    }
}

//Fermeture de la modale lorsque clic sur l'overlay 
function handleOverlayClick(event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
}