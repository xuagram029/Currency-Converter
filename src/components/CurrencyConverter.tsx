import { useAppSelector, useAppDispatch } from "../state/hooks";
import axios from "axios";
import {
  setFrom,
  setTo,
  setAmount,
  setResult,
} from "../state/features/converter/converterSlice";
import { useQuery, useMutation } from "@tanstack/react-query";
import "./style.css";

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

  const convertCurrency = async ({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }) => {
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

  const {
    data: currencies = {},
    isLoading,
    isError,
  } = useQuery({
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
  });

  const handleConvert = () => {
    if (from && to && amount > 0) {
      mutateAsync({ from, to, amount });
    } else {
      alert("Please fill in all fields.");
    }
  };

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading currencies</div>;

  return (
    <div className="currency-converter">
      <div className="currency-wrapper">
        <h1>Currency Converter</h1>
        <div className="currency-select-container">
          <label>From:</label>
          <select
            value={from}
            onChange={(e) => dispatch(setFrom(e.target.value))}
            className="currency-select"
          >
            <option value="">select currency</option>
            {Object.entries(currencies).map(([key, value]) => (
              <option key={key} value={key}>
                {value} ({key})
              </option>
            ))}
          </select>
        </div>
        <div className="currency-select-container">
          <label>To:</label>
          <select
            className="currency-select"
            value={to}
            onChange={(e) => dispatch(setTo(e.target.value))}
          >
            <option value="">select currency</option>
            {Object.entries(currencies).map(([key, value]) => (
              <option key={key} value={key}>
                {value} ({key})
              </option>
            ))}
          </select>
        </div>
        <div className="currency-select-container">
          <label>Amount:</label>
          <input
            className="currency-input"
            type="text"
            value={amount}
            onChange={(e) => dispatch(setAmount(Number(e.target.value)))}
          />
        </div>
        <div className="currency-result">
          <button onClick={handleConvert}>Convert</button>
          <h2>Result: {numberWithCommas(+result.toFixed(2))}</h2>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
