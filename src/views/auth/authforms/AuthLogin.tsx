import { Button, Checkbox, Label, TextInput, Radio , Spinner} from "flowbite-react";
import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { HiEye, HiEyeOff, HiMail, HiChat, HiDeviceMobile, HiCheckCircle, HiXCircle } from "react-icons/hi";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("login"); // "login" or "forgotPassword"
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [otpMethod, setOtpMethod] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [tempUsername, setTempUsername] = useState(""); // Store username during forgot password flow
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize OTP refs
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 4);
  }, []);

  // Check if passwords match whenever they change
  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(false);
    }
  }, [newPassword, confirmPassword]);

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    setLoginData({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });
    setStep(2);
  };

  const handleOtpMethodSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otpMethod) {
      setStep(3);
    }
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    
    console.log("Verifying OTP:", enteredOtp);
    console.log("Login data:", loginData);
    console.log("OTP method:", otpMethod);
    
    if (mode === "login") {
      // For login flow - redirect to dashboard after OTP verification
      navigate("/");
    } else {
      // For forgot password flow - move to set new password step
      setStep(4);
    }
  };

  const handleNewPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check if passwords match before submitting
    if (newPassword !== confirmPassword) {
      setPasswordTouched(true);
      setConfirmPasswordTouched(true);
      return;
    }
    
    // Here you would typically send the new password to your backend
    console.log("New password set:", newPassword);
    
    // Automatically populate login fields with username and new password
    setLoginData({
      username: tempUsername,
      password: newPassword
    });
    
    // Switch back to login mode and go to step 1
    setMode("login");
    setStep(1);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input
      if (value && index < 3) {
        const nextInput = otpInputRefs.current[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to focus previous input and clear current
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = otpInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
    
    // Handle backspace to clear current input
    if (e.key === 'Backspace' && otp[index] && index >= 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleForgotPasswordClick = () => {
    setMode("forgotPassword");
    // Store current username before clearing
    const currentUsername = (document.getElementById('username') as HTMLInputElement)?.value || '';
    setTempUsername(currentUsername);
    setStep(2); // Skip login step, go directly to OTP method selection
    setOtpMethod(""); // Reset OTP method
    setOtp(["", "", "", ""]); // Reset OTP
    setNewPassword(""); // Reset new password
    setConfirmPassword(""); // Reset confirm password
    setPasswordsMatch(false); // Reset match status
    setPasswordTouched(false); // Reset touched status
    setConfirmPasswordTouched(false); // Reset touched status
  };

  const handleBackToLogin = () => {
    setMode("login");
    setStep(1);
    setOtpMethod("");
    setOtp(["", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordsMatch(false);
    setPasswordTouched(false);
    setConfirmPasswordTouched(false);
  };

  // Step 1: Username and Password login (only for login mode)
  if (step === 1 && mode === "login") {
    return (
      <form onSubmit={handleLoginSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="username">Username</Label>
          </div>
          <TextInput
            id="username"
            name="username"
            type="text"
            sizing="md"
            required
            className="form-control"
            value={loginData.username}
            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <TextInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              sizing="md"
              required
              className="form-control pr-10"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div>
          <button 
            type="button" 
            className="text-primary text-sm font-medium"
            onClick={handleForgotPasswordClick}
          >
            Forgot Password ?
          </button>
        </div>
        <Button type="submit" color={"primary"} className="w-full bg-primary text-white">
          Sign in
        </Button>
      </form>
    );
  }

  // Step 2: OTP Method Selection (for both login and forgot password)
  if (step === 2) {
    return (
      <form onSubmit={handleOtpMethodSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {mode === "login" ? "Send OTP" : "Reset Password - Send OTP"}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {mode === "forgotPassword" 
              ? "Select a method to receive OTP for password reset" 
              : "Select a method to receive OTP for verification"}
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Radio 
                id="sms" 
                name="otpMethod" 
                value="sms"
                checked={otpMethod === "sms"}
                onChange={(e) => setOtpMethod(e.target.value)}
              />
              <Label htmlFor="sms" className="cursor-pointer flex items-center gap-2">
                <HiDeviceMobile className="h-5 w-5" />
                Send OTP on SMS
              </Label>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Radio 
                id="whatsapp" 
                name="otpMethod" 
                value="whatsapp"
                checked={otpMethod === "whatsapp"}
                onChange={(e) => setOtpMethod(e.target.value)}
              />
              <Label htmlFor="whatsapp" className="cursor-pointer flex items-center gap-2">
                <HiChat className="h-5 w-5" />
                Send OTP on WhatsApp
              </Label>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Radio 
                id="email" 
                name="otpMethod" 
                value="email"
                checked={otpMethod === "email"}
                onChange={(e) => setOtpMethod(e.target.value)}
              />
              <Label htmlFor="email" className="cursor-pointer flex items-center gap-2">
                <HiMail className="h-5 w-5" />
                Send OTP on Email
              </Label>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            type="button" 
            color="gray" 
            className="flex-1"
            onClick={mode === "login" ? () => setStep(1) : handleBackToLogin}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            className="flex-1 bg-primary text-white"
            disabled={!otpMethod}
          >
            Send OTP
          </Button>
        </div>
      </form>
    );
  }


  // Step 3: OTP Verification (for both login and forgot password)
  if (step === 3) {
    return (
      <form onSubmit={handleOtpSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {mode === "login" ? "Enter OTP" : "Reset Password - Enter OTP"}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a 4-digit OTP to your {otpMethod === 'sms' ? 'SMS' : otpMethod === 'whatsapp' ? 'WhatsApp' : 'email'}
          </p>
          
          <div className="flex justify-start gap-2 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                ref={(el) => otpInputRefs.current[index] = el}
                className="w-12 h-12 text-center text-xl font-semibold p-0"
                required
              />
            ))}
          </div>
          
          <div className="text-center">
            <button type="button" className="text-primary text-sm font-medium">
              Resend OTP
            </button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            type="button" 
            color="gray" 
            className="flex-1"
            onClick={() => setStep(2)}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            className="flex-1 bg-primary text-white"
            disabled={otp.some(digit => digit === "")}
          >
            Verify OTP
          </Button>
        </div>
      </form>
    );
  }

  // Step 4: Set New Password (only for forgot password mode)
  if (step === 4 && mode === "forgotPassword") {
    const showNewPasswordError = passwordTouched && newPassword && confirmPassword && !passwordsMatch;
    const showConfirmPasswordError = confirmPasswordTouched && confirmPassword && newPassword && !passwordsMatch;

    return (
      <form onSubmit={handleNewPasswordSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Set New Password</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please enter your new password below.
          </p>
          
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="newPassword">New Password</Label>
            </div>
            <div className="relative">
              <TextInput
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                sizing="md"
                required
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordTouched(true);
                }}
                className={`form-control pr-10 ${showNewPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your new password"
                color={showNewPasswordError ? "failure" : "gray"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
            </div>
            <div className="relative">
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                sizing="md"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordTouched(true);
                }}
                className={`form-control pr-10 ${showConfirmPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Confirm your new password"
                color={showConfirmPasswordError ? "failure" : "gray"}
              />
              <div className="absolute inset-y-0 right-0 pr-10 flex items-center">
                {confirmPassword && (
                  <>
                    {passwordsMatch ? (
                      <HiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <HiXCircle className="h-5 w-5 text-red-500" />
                    )}
                  </>
                )}
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
              </button>
            </div>
            {showConfirmPasswordError && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>

          {/* Success message when passwords match */}
          {passwordsMatch && newPassword && confirmPassword && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <HiCheckCircle className="h-4 w-4" />
                Passwords match! You can now proceed.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            type="button" 
            color="gray" 
            className="flex-1"
            onClick={() => setStep(3)}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            className="flex-1 bg-primary text-white"
            disabled={!newPassword || !confirmPassword || !passwordsMatch}
          >
            Set New Password
          </Button>
        </div>
      </form>
    );
  }

  return null;
};

export default AuthLogin;