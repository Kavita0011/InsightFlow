import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <SignIn 
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
              maxWidth: '400px',
            },
          },
        }}
      />
    </div>
  );
}
