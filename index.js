const { select, input, checkbox } = require('@inquirer/prompts')

let mensagem = "welcome to the APP";

let meta = {
    value: "tomar 3L de água por dia",
    checked: false,
}

let metas = [ meta ]

const cadastrarMeta = async () =>{
    const meta = await input({ message: "Digite a meta:"})

    if(meta.length == 0){
        mensagem = "A meta não pode ser vazia"
        return
    }

    metas.push(
        { value: meta, checked: false}
    )
    mensagem = "meta cadastrada com sucesso! :D"
}

const listarMetas = async()=>{
    const respostas = await checkbox({
        message: "use as setas para mudar de meta, espaço para marcar ou desmarcar e enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0){
        mensagem = 'nenhuma meta selecionada'
        return
    }

    respostas.forEach((resposta)=>{
        const meta = metas.find((m)=>{
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "Meta(s) marcada(s) como concluída(s)"
}   

const metasRealizadas = async()=>{
    const realizadas = metas.filter((meta)=>{
        return meta.checked
    })
    if(realizadas.length == 0){
        mensagem = 'nenhuma meta realizada :('
        return
    }

    await select({
        message: "Metas realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async()=>{
    const abertas = metas.filter((meta)=>{
        return !meta.checked
    })
    if(abertas.length == 0){
        mensagem = "não existem metas abertas! :)"
        return
    }

    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async() => {
    const metasDesmarcadas = metas.map((meta)=>{
        return { value: meta.value, checked: false } 
    })

    const itemsADeletar = await checkbox({
        message: "selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemsADeletar.length == 0){
        mensagem = "nenhum item para deletar!"
        return
    }

    itemsADeletar.forEach((item)=>{
        metas = metas.filter((meta)=>{
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = ()=>{
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () =>{
    while(true){
        mostrarMensagem()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })


        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
           case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("obrigado")
                return     
        }
    }
}

start()