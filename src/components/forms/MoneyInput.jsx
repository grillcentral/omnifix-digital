import Input from "./Input.jsx";

export default function MoneyInput(props) {
  return <Input type="number" min="0" step="0.01" inputMode="decimal" {...props} />;
}
