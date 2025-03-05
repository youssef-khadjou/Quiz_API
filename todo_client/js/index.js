document.addEventListener("DOMContentLoaded", function () {
    const boutonActualiser = document.getElementById("button");
    const listeTaches = document.getElementById("taches");
    const tacheActuelle = document.getElementById("currenttask");
    const supprimerQuestionnaire = document.getElementById("delete");

    actualiserListeQuestionnaires();

    boutonActualiser.addEventListener("click", actualiserListeQuestionnaires);
    supprimerQuestionnaire.addEventListener("click", deleteAll);

    function actualiserListeQuestionnaires() {
        fetch("http://127.0.0.1:5000/questionnaires")
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error("Erreur lors de la récupération des questionnaires");
                }
                return reponse.json();
            })
            .then(donnees => {
                listeTaches.innerHTML = "";
                if (donnees.length === 0) {
                    listeTaches.innerHTML = "<p>Aucun questionnaire disponible.</p>";
                    return;
                }
                
                const ul = document.createElement("ul");
                listeTaches.appendChild(ul);
                
                donnees.forEach(questionnaire => {
                    const elementListe = document.createElement("li");
                    const lien = document.createElement("a");
                    lien.textContent = questionnaire.name;
                    lien.href = "#";
                    lien.style.color = "black";
                    lien.style.textDecoration = "none";
                    lien.addEventListener("click", () => afficherDetails(questionnaire));
                    
                    const boutonSupprimer = document.createElement("button");
                    boutonSupprimer.textContent = "Supprimer";
                    boutonSupprimer.addEventListener("click", () => supprimerCeQuestionnaire(questionnaire.id));
                    
                    elementListe.appendChild(lien);
                    elementListe.appendChild(boutonSupprimer);
                    ul.appendChild(elementListe);
                });
            })
            .catch(erreur => {
                console.error("Erreur :", erreur);
                listeTaches.innerHTML = "<p>Aucun questionnaire disponible !</p>";
            });
    }

    function supprimerCeQuestionnaire(id) {
        fetch(`http://127.0.0.1:5000/questionnaires/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            actualiserListeQuestionnaires();
            tacheActuelle.innerHTML = "";
        })
        .catch(erreur => {
            console.error("Erreur lors de la suppression :", erreur);
            alert("Impossible de supprimer le questionnaire");
        });
    }

    function deleteAll() {
        if (confirm("Voulez-vous vraiment supprimer TOUS les questionnaires ?")) {
            fetch("http://127.0.0.1:5000/questionnaires/delete-all", {
                method: "DELETE"
            })
            .then(reponse => {
                if (!reponse.ok) {
                    throw new Error("Erreur lors de la suppression de tous les questionnaires");
                }
                listeTaches.innerHTML = "<p>Tous les questionnaires ont été supprimés.</p>";
                tacheActuelle.innerHTML = "";
                alert("Tous les questionnaires ont été supprimés avec succès.");
            })
            .catch(erreur => {
                console.error("Erreur :", erreur);
                alert("Impossible de supprimer tous les questionnaires");
            });
        }
    }

    function afficherDetails(questionnaire) {
        tacheActuelle.innerHTML = `
            <p><strong>Nom :</strong> <input type="text" id="modifierNom" value="${questionnaire.name}" style="width: 310px;"></p>
            <p><strong>URL :</strong> <input type="text" id="modifierURL" value="${questionnaire.url}" style="width: 310px;"></p>
            <button id="enregistrerModifications">Enregistrer</button>
            <div id="listeQuestions">
                <h3>Liste des questions :</h3>
                <ul id="questionsUl"></ul>
                <h3>Ajouter une question :</h3>
                <input type="text" id="nouvelleQuestion" placeholder="Nouvelle question" style="width: 310px;">
                <button id="ajouterQuestion">Ajouter</button>
            </div>
        `;
        
        document.getElementById("enregistrerModifications").addEventListener("click", () => {
            mettreAJourQuestionnaire(questionnaire.id);
        });

        document.getElementById("ajouterQuestion").addEventListener("click", () => {
            ajouterQuestion(questionnaire.id);
        });
        
        chargerQuestions(questionnaire.id);
    }

    function chargerQuestions(idQuestionnaire) {
        fetch(`http://127.0.0.1:5000/questionnaires/${idQuestionnaire}/questions`)
            .then(reponse => reponse.json())
            .then(questions => {
                const questionsUl = document.getElementById("questionsUl");
                questionsUl.innerHTML = "";
                
                if (questions.length === 0) {
                    questionsUl.innerHTML = "<li>Ce questionnaire n'a pas de questions.</li>";
                } else {
                    questions.forEach(question => {
                        const elementQuestion = document.createElement("li");
                        elementQuestion.innerHTML = `
                            ${question.title}
                            <button onclick="modifierQuestion(${idQuestionnaire}, ${question.id}, '${question.title}')">Modifier</button>
                            <button onclick="supprimerQuestion(${idQuestionnaire}, ${question.id})">Supprimer</button>
                        `;
                        questionsUl.appendChild(elementQuestion);
                    });
                }
            })
            .catch(erreur => {
                console.error("Erreur lors de la récupération des questions :", erreur);
                const questionsUl = document.getElementById("questionsUl");
                questionsUl.innerHTML = "<li>Erreur lors de la récupération des questions.</li>";
            });
    }

    function ajouterQuestion(idQuestionnaire) {
        const nouvelleQuestion = document.getElementById("nouvelleQuestion").value;
        
        if (!nouvelleQuestion.trim()) {
            alert("Veuillez saisir une question");
            return;
        }

        fetch(`http://127.0.0.1:5000/questionnaires/${idQuestionnaire}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title: nouvelleQuestion,
                questionType: "text",
                url: ""
            })
        })
        .then(() => {
            document.getElementById("nouvelleQuestion").value = "";
            chargerQuestions(idQuestionnaire);
        })
        .catch(erreur => {
            console.error("Erreur lors de l'ajout de la question :", erreur);
            alert("Impossible d'ajouter la question");
        });
    }

    function modifierQuestion(idQuestionnaire, idQuestion, ancienTitre) {
        const nouveauTitre = prompt("Modifier la question :", ancienTitre);
        
        if (nouveauTitre !== null) {
            fetch(`http://127.0.0.1:5000/questionnaires/${idQuestionnaire}/questions/${idQuestion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: nouveauTitre,
                    questionType: "text"
                })
            })
            .then(() => chargerQuestions(idQuestionnaire))
            .catch(erreur => {
                console.error("Erreur lors de la modification de la question :", erreur);
                alert("Impossible de modifier la question");
            });
        }
    }

    function supprimerQuestion(idQuestionnaire, idQuestion) {
        if (confirm("Voulez-vous vraiment supprimer cette question ?")) {
            fetch(`http://127.0.0.1:5000/questionnaires/${idQuestionnaire}/questions/${idQuestion}`, {
                method: "DELETE"
            })
            .then(() => chargerQuestions(idQuestionnaire))
            .catch(erreur => {
                console.error("Erreur lors de la suppression de la question :", erreur);
                alert("Impossible de supprimer la question");
            });
        }
    }

    function mettreAJourQuestionnaire(id) {
        const nouveauNom = document.getElementById("modifierNom").value;
        const nouvelleURL = document.getElementById("modifierURL").value;
        
        if (!nouveauNom.trim()) {
            alert("Le nom du questionnaire ne peut pas être vide");
            return;
        }
        
        fetch(`http://127.0.0.1:5000/questionnaires/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nouveauNom, url: nouvelleURL })
        })
        .then(() => {
            actualiserListeQuestionnaires();
            alert("Questionnaire mis à jour avec succès");
        })
        .catch(erreur => {
            console.error("Erreur :", erreur);
            alert("Impossible de mettre à jour le questionnaire");
        });
    }

    window.modifierQuestion = modifierQuestion;
    window.supprimerQuestion = supprimerQuestion;
});