const perguntaForm = document.getElementById("formulario_pergunta");

const openaiKey = "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";
const consulta_pt1 = "Responda somente com sim ou não se o texto abaixo é relacionado diretamente ou indiretamente a programação:";

var input = document.getElementById("campo_pergunta");
    input.addEventListener("keyup", async (event1) => {
         if (event1.keyCode == 13) {
            event1.preventDefault();
             document.getElementById("botao-pergunta").click();
        }
    });

//Checa se tem pergunta
if (perguntaForm){
    perguntaForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        document.getElementById("botao-pergunta").value = "Pesquisando...";

        const pergunta = document.getElementById("campo_pergunta").value;
        console.log(pergunta);

        document.getElementById("pergunta-saida").innerHTML = pergunta[0].toUpperCase() + pergunta.substring(1);;
        document.getElementById("resposta-saida").innerHTML = "";


            await fetch("https://api.openai.com/v1/completions", {
                method: "POST",
                headers:{
                    Accept: "aplication/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + openaiKey,
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: pergunta,
                    max_tokens: 2400,
                    temperature: 0.2
                })
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                console.log(dados);
                fetch("https://api.openai.com/v1/completions", {
                        method: "POST",
                        headers:{
                        Accept: "aplication/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + openaiKey,
                        },
                        body: JSON.stringify({
                            model: "text-davinci-003",
                            prompt: consulta_pt1 + dados.choices[0].text,
                            max_tokens: 50,
                            temperature: 0
                        })
                    })
                    .then((resposta2) => resposta2.json())
                    .then((dados1) => {
                        if (dados1.choices[0].text == "\n\nNão."){
                            console.log(dados1);
                            document.getElementById("resposta-saida").innerHTML = "Sua pergunta não é relacionada a programação!";
                            document.getElementById("botao-pergunta").value = "Pesquisar";
                        }
                        else if (dados1.choices[0].text == "\n\nSim."){
                            console.log(dados1);
                            document.getElementById("resposta-saida").innerHTML = dados.choices[0].text;
                            document.getElementById("botao-pergunta").value = "Pesquisar";
                        }
                    })
                    .catch(() => {
                    document.getElementById("resposta-saida").innerHTML = "Sem resposta :(";
                    });
            })
            .catch(() => {
                document.getElementById("resposta-saida").innerHTML = "Sem resposta :(";
            });
    })
}
