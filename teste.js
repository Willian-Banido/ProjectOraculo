const xlsx = require("xlsx");
const readlineSync = require("readline-sync");
const fs = require("fs");

const ARQUIVO = "usuarios.xlsx";

// Função para verificar se o arquivo Excel existe e criar um se não existir
function criarArquivoSeNaoExistir() {
    try {
        if (!fs.existsSync(ARQUIVO)) {
            const workbook = xlsx.utils.book_new();
            const ws = xlsx.utils.aoa_to_sheet([["Usuario", "Senha"]]);
            xlsx.utils.book_append_sheet(workbook, ws, "Usuarios");
            xlsx.writeFile(workbook, ARQUIVO);
        }
    } catch (error) {
        console.error("Erro ao criar o arquivo:", error);
    }
}

// Função para verificar se o usuário já existe no arquivo Excel
function usuarioExiste(usuario) {
    const workbook = xlsx.readFile(ARQUIVO);
    const worksheet = workbook.Sheets["Usuarios"];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === usuario) {
            return true;
        }
    }
    return false;
}

// Função para salvar o usuário e a senha no arquivo Excel
function salvarUsuario(usuario, senha) {
    const workbook = xlsx.readFile(ARQUIVO);
    const worksheet = workbook.Sheets["Usuarios"];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    data.push([usuario, senha]);

    const novaPlanilha = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets["Usuarios"] = novaPlanilha;
    xlsx.writeFile(workbook, ARQUIVO);

    console.log("Usuário cadastrado com sucesso:", usuario);
}

// Função principal
function main() {
    criarArquivoSeNaoExistir();

    let usuario;
    do {
        usuario = readlineSync.question("Digite seu nome de usuário: ");

        if (usuarioExiste(usuario)) {
            console.log(`O nome de usuário '${usuario}' já existe. Tente outro.`);
        } else {
            break;
        }
    } while (true);

    const senha = readlineSync.question("Digite uma senha: ", { hideEchoBack: false });

    while (true) {
        const senha1 = readlineSync.question("Confirme sua senha: ", { hideEchoBack: false
         });
        if (senha === senha1) {
            break;
        } else {
            console.log("As senhas não são iguais. Tente novamente.");
        }
    }

    salvarUsuario(usuario, senha);

    const workbook = xlsx.readFile(ARQUIVO);
    const worksheet = workbook.Sheets["Usuarios"];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    console.log("\nUsuários cadastrados no sistema:");
    data.slice(1).forEach((row) => console.log(`Usuário: ${row[0]}`));
}

main();