// =========== IMPORTACOES ===========

// Importando o módulo bip32 para lidar com carteiras HD (Hierarchical Deterministic)
import * as bip32 from 'bip32';

// Importando o módulo bip39 para gerar e manipular mnemônicos (frases de recuperação)
import * as bip39 from 'bip39';

// Importando o módulo bitcoinjs-lib para criar e manipular transações e endereços Bitcoin
import * as bitcoin from 'bitcoinjs-lib';

// =========== CODIGO ===========

// Definindo a rede como Testnet (rede de teste do Bitcoin, usada para desenvolvimento)
const network = bitcoin.networks.testnet;

// Definindo o caminho de derivação das carteiras HD (Hierarchical Deterministic)
// "m/49'/1'/0'/0" é o caminho BIP49 padrão para carteiras compatíveis com endereços P2SH-P2WPKH
const path = 'm/49/1/0/0';

// Gerando uma frase mnemônica aleatória, que é uma sequência de 12 ou 24 palavras
// Esta frase pode ser usada para recuperar a carteira
let mnemonic = bip39.generateMnemonic();

// Convertendo a frase mnemônica para uma seed binária, que é usada para gerar a raiz da carteira HD
const seed = bip39.mnemonicToSeedSync(mnemonic);

// Criando a raiz da carteira HD a partir da seed e definindo a rede (testnet)
let root = bip32.fromSeed(seed, network);

// Derivando uma conta específica a partir da raiz da carteira usando o caminho especificado
// Isso permite a criação de múltiplas contas dentro da mesma carteira HD
let account = root.derivePath(path);

// Derivando a primeira chave pública e privada da conta
// `.derive(0).derive(0)` indica que estamos criando a primeira chave na primeira conta
let node = account.derive(0).derive(0);

// Criando um endereço Bitcoin a partir da chave pública gerada acima
// O tipo de endereço criado é P2PKH (Pay to Public Key Hash)
let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey, // Chave pública derivada
    network: network, // Rede testnet
}).address;

// =========== PRINTAR ===========

console.log("========== CARTEIRA GERADA ==========");
console.log("Endereco: ", btcAddress);
console.log("Chave privada: ", node.toWIF());
console.log("Seed: ", mnemonic);
console.log("=====================================");
