import { addTokenToPalette } from "../../services/api.ts";

interface AddTokenToPaletteProps {
    tokenPaletteId: string;
    oracleId: string;
    side: number;
}

const AddTokenToPalette = ({ tokenPaletteId, oracleId, side }: AddTokenToPaletteProps) => {
    const handleAdd = async () => {
        await addTokenToPalette(tokenPaletteId, oracleId, side);
    };

    return <button onClick={handleAdd}>Add to Palette</button>;
};

export default AddTokenToPalette;
