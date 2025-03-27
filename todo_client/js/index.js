import { createApp, ref, onMounted } from 'vue'

const app = createApp({
    setup() {
        const quizList = ref([])
        const selectedQuiz = ref(null)
        const newQuizName = ref("")
        const newQuizURL = ref("")

        const questionList = ref([])
        const selectedQuestion = ref(null)
        const newQuestionText = ref("")
        const newQuestionCorrectAnswer = ref("")
        const newQuestionOptions = ref([])

        // Charger les quizz depuis le fichier JSON
        const fetchQuizzes = async () => {
            try {
                const response = await fetch("datas/datas.json") // Charge les données
                if (!response.ok) throw new Error("Erreur lors du chargement des quizz")
                const data = await response.json()
                quizList.value = data
            } catch (error) {
                console.error("Erreur:", error)
                quizList.value = []
            }
        }

        // Charger les questions d'un quizz
        const fetchQuestions = (quizId) => {
            const quiz = quizList.value.find(q => q.id === quizId)
            questionList.value = quiz ? quiz.questions : []
        }

        const selectQuiz = (quiz) => {
            selectedQuiz.value = { ...quiz }
            fetchQuestions(quiz.id)
        }

        // Ajouter un quizz
        const addQuiz = async () => {
            if (!newQuizName.value) {
                alert("Veuillez entrer un nom de quiz.")
                return
            }

            try {
                await fetch("/api/questionnaires", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newQuizName.value, url: newQuizURL.value })
                })
                newQuizName.value = ""
                newQuizURL.value = ""
                fetchQuizzes()
            } catch (error) {
                console.error("Erreur:", error)
                alert("Impossible d'ajouter le quizz.")
            }
        }

        onMounted(fetchQuizzes)

        return {
            quizList,
            selectedQuiz,
            newQuizName,
            newQuizURL,
            fetchQuizzes,
            selectQuiz,
            addQuiz,
        }
    }
})

app.mount("#app")
