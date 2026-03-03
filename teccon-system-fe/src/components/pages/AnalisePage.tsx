import React from 'react';
import { useParams } from 'react-router-dom';
import AnaliseTemplate from '../tamplates/AnaliseTemplate';
import GerenciarAnalisesTemplate from '../tamplates/GerenciarAnalisesTemplate';

/**
 * AnalisePage
 *
 * /analise        → listagem de todas as coletas (para o operário escolher qual analisar)
 * /analise/:id    → análise individual de uma coleta (via menu ou QR Code futuramente)
 */
const AnalisePage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();

    if (id) {
        return <AnaliseTemplate />;
    }

    return <GerenciarAnalisesTemplate />;
};

export default AnalisePage;