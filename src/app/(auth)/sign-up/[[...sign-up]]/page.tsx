import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='w-full min-h-[calc(100vh-4.1rem)] flex items-center justify-center'>
      <SignUp fallbackRedirectUrl={"/income-expense"}/>
    </div>
  );
}