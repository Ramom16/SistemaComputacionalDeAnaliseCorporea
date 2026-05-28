export class DadosCorporais {   
#idUsuario    
#peso_kg      
#altura_cm    
#genero      
#idade        

    constructor(
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade
    ) {
        this.#idUsuario = idUsuario;
        this.#peso_kg = peso_kg;
        this.#altura_cm = altura_cm;
        this.#genero = genero;
        this.#idade = idade;
    }
    // GETTERS

    get idUsuario() {
        return this.#idUsuario;
    }
    get peso_kg() {
        return this.#peso_kg;
    }
    get altura_cm() {
        return this.#altura_cm;
    }
    get genero() {
        return this.#genero;
    }
    get idade() {
        return this.#idade;
    }

    //SETTERS
    set idUsuario(value) {
        this.#validarIdUsuario(value);
        this.#idUsuario = value;
    }
    set peso_kg(value) {
        this.#validarPeso(value);
        this.#peso_kg = value;
    }
    set altura_cm(value) {
        this.#validarAltura(value);
        this.#altura_cm = value;
    }
    set genero(value) {
        this.#validarGenero(value);
        this.#genero = value;
    }
    set idade(value) {
        this.#validarIdade(value);
        this.#idade = value;
    }

    //VALIDAÇÕES
    #validarPeso(peso) {
        if (typeof peso !== 'number' || peso <= 0) {
            throw new Error('Peso deve ser um número positivo.');
        }
    }
    
    #validarIdUsuario(idUsuario) {
        if (!idUsuario) {
            throw new Error('ID do usuário é obrigatório.');
        }
    }

    #validarAltura(altura) {
        if (typeof altura !== 'number' || altura <= 0) {
            throw new Error('Altura deve ser um número positivo.');
        }
    }

    #validarGenero(genero) {
        const generosValidos = ['masculino', 'feminino', 'outro'];
        if (!generosValidos.includes(genero.toLowerCase())) {
            throw new Error('Gênero deve ser "masculino", "feminino" ou "outro".');
        }
    }
    #validarIdade(idade) {
        if (typeof idade !== 'number' || idade < 0) {
            throw new Error('Idade deve ser um número não negativo.');
        }
    }

    //FACTORY METHODS

    static criar({ 
        idUsuario, 
        peso_kg, 
        altura_cm, 
        genero, 
        idade }) 
    {
        if (!idUsuario || !peso_kg || !altura_cm || !genero || idade === undefined) {
            throw new Error("Dados obrigatórios faltando");
        }
        return new DadosCorporais(
            idUsuario,
            peso_kg,
            altura_cm,
            genero,
            idade
        );
    }

    static editar({ 
        idUsuario, 
        peso_kg,
        altura_cm,
        genero,
        idade }, id){
        
            if (!id) {
        throw new Error("ID é obrigatório para edição");
        }

        if (!idUsuario || !peso_kg || !altura_cm || !genero || idade === undefined) {
            throw new Error("Dados obrigatórios faltando");
        }

        return new DadosCorporais(
            idUsuario,
            peso_kg,
            altura_cm,
            genero,
            idade
        );
    }

}