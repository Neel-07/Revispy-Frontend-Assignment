import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registrationEmail');
    const storedCode = sessionStorage.getItem('verificationCode');

    if (!storedEmail || !storedCode) {
      navigate('/register');
    } else {
      const [username, domain] = storedEmail.split('@');
      const maskedUsername = username.slice(0, 3) + '***';
      setEmail(`${maskedUsername}@${domain}`);
    }
  }, [navigate]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value.slice(0, 1);
    setVerificationCode(newCode);
    setError('');

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!verificationCode[index] && index > 0) {
        const newCode = [...verificationCode];
        newCode[index - 1] = '';
        setVerificationCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    const newCode = [...verificationCode];
    pastedData.split('').forEach((char: string, index: number) => {
      if (index < 8) newCode[index] = char;
    });
    setVerificationCode(newCode);
    setError('');

    const focusIndex = Math.min(pastedData.length, 7);
    inputRefs.current[focusIndex]?.focus();
  };

  const generateNewVerificationCode = (): string => {
    const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    sessionStorage.setItem('verificationCode', newCode);
    return newCode;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verificationCode.some(digit => !digit)) {
      setError('Please enter all digits');
      return;
    }

    setLoading(true);
    try {
      const enteredCode = verificationCode.join('');
      const storedCode = sessionStorage.getItem('verificationCode');

      if (!storedCode) {
        setError('Verification session expired. Please register again.');
        navigate('/register');
        return;
      }

      if (enteredCode !== storedCode) {
        setError('Invalid verification code. Please try again.');
        return;
      }

      sessionStorage.removeItem('verificationCode');
      sessionStorage.removeItem('registrationEmail');

      navigate('/login');
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    const newCode = generateNewVerificationCode();
    console.log('New verification code:', newCode);
    setError('New verification code sent! Check your email.');
    setVerificationCode(['', '', '', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-[576px] rounded-3xl border border-solid border-stone-300 bg-white p-6 sm:p-8 md:p-12">
        <div className="text-center text-2xl sm:text-3xl font-semibold text-black">
          Verify your email
        </div>
        <div className="mt-4 sm:mt-8 text-sm sm:text-base text-center text-black">
          Enter the 8 digit code you have received on{' '}
          <span className="font-medium break-all">{email}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-8 sm:mt-12 text-sm sm:text-base text-black">
            Code
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-2">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInput(index, e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-[40px] w-[40px] sm:h-[47px] sm:w-[47px] shrink-0 rounded-md border border-solid border-stone-300 bg-white text-center text-base sm:text-lg font-medium focus:border-black focus:outline-none"
                maxLength={1}
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || verificationCode.some(digit => !digit)}
            className="mt-8 sm:mt-16 w-[96%] min-h-[48px] sm:min-h-[56px] rounded-md border border-solid border-black bg-black px-4 py-3 sm:py-5 text-sm sm:text-base font-medium tracking-wider text-center text-white uppercase disabled:bg-gray-400 disabled:border-gray-400"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <button
          onClick={handleResendCode}
          className="mt-4 w-full text-center text-sm text-black underline hover:text-gray-600"
        >
          Resend verification code
        </button>
        <p className='mt-4 w-full text-center text-sm hover:text-black text-gray-600'>To find the verification code, check the Console tab (Ctrl+Shift+J)</p>
      </div>
    </div>
  );
}

export default VerifyEmail;