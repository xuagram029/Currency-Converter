import { useAppSelector, useAppDispatch } from "../state/hooks";
import axios from "axios";
import {
  setFrom,
  setTo,
  setAmount,
  setResult,
} from "../state/features/converter/converterSlice";
import { useQuery, useMutation } from "@tanstack/react-query";

type Currencies = { [key: string]: string };

const CurrencyConverter = () => {
  const dispatch = useAppDispatch();
  const { from, to, amount, result } = useAppSelector(
    (state) => state.converter
  );

  const fetchCurrencies = async (): Promise<Currencies> => {
    try {
      const res = await axios.get(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw error;
    }
  };

  const convertCurrency = async ({from, to, amount} : {from: string, to: string, amount: number}) => {
    try {
      const res = await axios.get(
        `https://api.fxratesapi.com/convert?from=${from}&to=${to}&amount=${amount}`
      );
      return res.data.result; 
    } catch (error) {
      console.error("Error converting currency:", error);
      throw error;
    }
  };

  const {data: currencies = {}, isLoading, isError} = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
  });

  const { mutateAsync } = useMutation({
    mutationFn: convertCurrency,
    onSuccess: (data) => {
      dispatch(setResult(data));
    },
    onError: (error) => {
      console.error("Error converting currency:", error);
    },
  })

  const handleConvert = () => {
    if (from && to && amount > 0) {
      mutateAsync({ from, to, amount });
    } else {
      alert("Please fill in all fields.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading currencies</div>;

  return (
    <div>
      <h1>Currency Converter</h1>
      <div>
        <label>From:</label>
        <select
          value={from}
          onChange={(e) => dispatch(setFrom(e.target.value))}
        >
          <option value="">select currency</option>
          {Object.entries(currencies).map(([key, value]) => (
            <option key={key} value={key}>
              {value} ({key})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To:</label>
        <select value={to} onChange={(e) => dispatch(setTo(e.target.value))}>
          <option value="">select currency</option>
          {Object.entries(currencies).map(([key, value]) => (
            <option key={key} value={key}>
              {value} ({key})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => dispatch(setAmount(Number(e.target.value)))}
        />
      </div>
      <button onClick={handleConvert}>Convert</button>
      <h2>Result: {result.toFixed(2)}</h2>
    </div>
  );
};

export default CurrencyConverter;
