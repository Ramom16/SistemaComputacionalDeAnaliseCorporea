export class Exercicio {

    #id;
    #nome_exercicio;
    #descricao_exercicio;
    #caminho_video;

    constructor(id, nome_exercicio, descricao_exercicio, caminho_video){
        this.#id = id;
        this.#nome_exercicio = nome_exercicio;
        this.#descricao_exercicio = descricao_exercicio;
        this.#caminho_video = caminho_video;
    }
    
    get Id(){
        return this.#id;
    };

    get nome_exercicio(){
        return this.#nome_exercicio;
    }

    get descricao_exercicio(){
        return this.#descricao_exercicio;
    }

    get caminho_video(){
        return this.#caminho_video;
    }

    //SETTERS

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    set nome(value){
        this.#validarNome_exercicio(value)
        this.#nome_exercicio = value
    }

    set descricao(value){
        this.#validarDescricao(value);
        this.#descricao_exercicio = value
    }

    set caminho_video(value){
        this.#validarCaminho(value);
        this.#caminho_video = value;
    }

    //VALIDAÇÃO
    #validarId(value) {
        if (value === undefined || typeof value !== "number" || !value) {
            throw new Error("ID do usuário inválido");
        }
    }

    #validarNome_exercicio(value) {
        if (value === undefined || typeof value !== "string" || value.trim().length < 5 || value.trim() > 100) {
            throw new Error("Nome do exercício inválido");
        }
    }

    #validarDescricao(value){
        if (!value || typeof value !== "string" ||value.trim().length < 5 || value.trim().length > 100)
            throw new Error("Descrição do exercício inválido");
    }

    #validarCaminho(value){
        if (!value || typeof value !== "string" )
            throw new Error("Caminho de vídeo do exercício inválido");
    }

    // FACTORY

static criar({
    nome_exercicio,
    descricao_exercicio,
    caminho_video,
}) {
    if (
        nome_exercicio === undefined ||
        descricao_exercicio === undefined ||
        caminho_video === undefined
    ) {
        throw new Error("Dados obrigatórios faltando");
    }

    return new Exercicio(
        id,
        nome_exercicio,
        descricao_exercicio,
        caminho_video
    );
}

static editar({
    id,
    nome_exercicio,
    descricao_exercicio,
    caminho_video,
}) {

    if (id === undefined) {
        throw new Error("ID obrigatório");
    }

    return new Exercicio(
        id,
        nome_exercicio,
        descricao_exercicio,
        caminho_video
    );
}
}