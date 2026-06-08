const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Chaves autorizadas no seu sistema (Você pode mudar ou criar novas aqui)
let bancoChaves = {
    "ORION-VIP-99": { expiracao: "2026-12-31", hwid: null, ativo: true },
    "ORION-TESTE-1": { expiracao: "2026-07-10", hwid: null, ativo: true }
};

// Rota onde o script do Roblox vai checar a chave
app.post('/api/validar-acesso', (req, res) => {
    const { chave, hwid } = req.body;

    if (!bancoChaves[chave]) {
        return res.status(403).json({ status: "REJEITADO", mensagem: "Chave inválida!" });
    }

    const dadosChave = bancoChaves[chave];

    if (!dadosChave.ativo) {
        return res.status(403).json({ status: "REJEITADO", mensagem: "Chave revogada!" });
    }

    // Trava de Segurança por Hardware (HWID)
    if (dadosChave.hwid === null) {
        dadosChave.hwid = hwid; // Prende a chave no celular de quem usou primeiro
    } else if (dadosChave.hwid !== hwid) {
        return res.status(403).json({ status: "REJEITADO", mensagem: "Chave em uso em outro aparelho!" });
    }

    return res.json({ status: "AUTORIZADO", mensagem: "Acesso liberado com sucesso!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Orion ativo na porta ${PORT}`);
});
