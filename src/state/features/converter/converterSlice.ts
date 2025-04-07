import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConverterState {
    from: string;
    to: string;
    amount: number;
    result: number;
}

const initialState: ConverterState = {
    from: '',
    to: '',
    amount: 1,
    result: 0,
};

export const converterSlice = createSlice({
    name: 'converter',
    initialState,
    reducers: {
        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload;
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload;
        },
        setAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
        },
        setResult: (state, action: PayloadAction<number>) => {
            state.result = action.payload;
        },
    },
});

export const { setFrom, setTo, setAmount, setResult } = converterSlice.actions

export default converterSlice.reducer