npx azle new transaction_records
cd transaction_records
mkdir src
touch src/index.ts tsconfig.json dfx.json
npm install azle

echo 'import { Principal, Time, Nat, $query, $update } from "azle";

type TransactionRecord = {
  from: Principal;
  to: Principal;
  amount: Nat;
  timestamp: Time;
};

let transactionRecords: TransactionRecord[] = [];

$query;
export function getAllTransactions(): TransactionRecord[] {
  return transactionRecords;
}

$update;
export function recordTransaction(from: Principal, to: Principal, amount: Nat): void {
  if (Principal.equal(from, to) || amount.isZero() || amount.isNegative()) return;
  const newRecord: TransactionRecord = { from, to, amount, timestamp: Time.now() };
  transactionRecords.push(newRecord);
}' > src/index.ts

echo '{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    "moduleResolution": "node",
    "allowJs": true,
    "outDir": "HACK_BECAUSE_OF_ALLOW_JS"
  }
}' > tsconfig.json

echo '{
  "canisters": {
    "transaction_records": {
      "type": "custom",
      "build": "npx azle transaction_records",
      "root": "src",
      "ts": "src/index.ts",
      "candid": "src/index.did",
      "wasm": ".azle/transaction_records/transaction_records.wasm.gz"
    }
  }
}' > dfx.json

dfx start --background
dfx deploy
dfx canister call transaction_records recordTransaction '(principal "sender_id", principal "receiver_id", 100)'
dfx canister call transaction_records getAllTransactions
dfx stop
