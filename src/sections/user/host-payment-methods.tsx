import { useCallback, useEffect, useState } from 'react'
import Label from 'src/components/label/label'
import { getHostPaymentMethods } from 'src/utils/queries/invoice'

type HostPaymentMethodsProps = {
  id: number;
};
interface IPaymentMethod {
  account_name: string;
  account_no: string;
  bank_name: string;
  branch_name: string;
  host: number;
  id: number;
  is_default: boolean;
  m_type: string;
  routing_number: string;
}
export default function HostPaymentMethods({ id }: HostPaymentMethodsProps) {
  const [payMethods, setPayMethods] = useState<IPaymentMethod[]>([]);

  const getPaymentMethods = useCallback(async () => {
    try {
      const response = await getHostPaymentMethods(id);
      if (!response.success) throw response.data;
      setPayMethods(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getPaymentMethods();
  }, [getPaymentMethods, id]);
  console.log(payMethods);
  return (
    <div>
      {/* <h1>Payment Methods</h1> */}
      {payMethods.map((payMethod) =>
        payMethod.m_type === 'bank' ? (
          <BankMethod payMethod={payMethod} />
        ) : (
          <MCashMethod payMethod={payMethod} />
        )
      )}
    </div>
  );
}

interface IPaymentMethodProps {
  payMethod: IPaymentMethod;
}
function BankMethod({ payMethod }: IPaymentMethodProps) {
  const { bank_name, branch_name, account_name, account_no, routing_number, is_default } =
    payMethod;
  return (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid', width: '300px'}}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
        <h4 style={{ margin: '0px', font: '20px' }}>Bank</h4>
        {is_default ? <Label>Default</Label> : ''}
      </div>
      <span>{bank_name} , </span>
      <span>{branch_name}</span>
      <p>{account_name}</p>
      <p>Account No - {account_no}</p>
      <p>Routing Number - {routing_number}</p>
    </div>
  );
}
function MCashMethod({ payMethod }: IPaymentMethodProps) {
  const { m_type, account_name, account_no, is_default } = payMethod;
  return (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid', width: '300px'}}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <h4 style={{ textTransform: 'capitalize',margin: '0px', font: '20px', marginBottom: '20px' }}>{m_type}</h4>
        {is_default ? <Label>Default</Label> : ''}
      </div>
      <span>{account_name} - </span>
      <span>{account_no}</span>
    </div>
  );
}
