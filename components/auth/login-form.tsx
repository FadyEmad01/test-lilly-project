"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleX, Eye, EyeOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Spinner } from "../ui/spinner";
import { USER } from "@/constants/USER";
import { redirect } from "next/navigation";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

// Graduation Cap Component
const GraduationCap = ({ color = "#2D2D2D" }: { color?: string }) => {
  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '-25px',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
    >
      {/* Mortarboard (flat square top) */}
      <div
        style={{
          width: '100px',
          height: '8px',
          backgroundColor: color,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%) perspective(100px) rotateX(20deg)',
          borderRadius: '2px',
        }}
      />

      {/* Cap base (the part that sits on head) */}
      <div
        style={{
          width: '70px',
          height: '25px',
          backgroundColor: color,
          position: 'absolute',
          left: '50%',
          top: '8px',
          transform: 'translateX(-50%)',
          borderRadius: '4px 4px 2px 2px',
          clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Tassel */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '4px',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Tassel button */}
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Tassel cord */}
        <div
          style={{
            width: '2px',
            height: '20px',
            backgroundColor: '#FFD700',
            position: 'absolute',
            left: '50%',
            top: '6px',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Tassel fringe */}
        <div
          style={{
            width: '12px',
            height: '10px',
            background: 'linear-gradient(to bottom, #FFD700, #FFA500)',
            position: 'absolute',
            left: '50%',
            top: '24px',
            transform: 'translateX(-50%)',
            borderRadius: '0 0 3px 3px',
          }}
        />
      </div>
    </div>
  );
};

// AnimatedLoginForm with proper callbacks
interface AnimatedLoginFormProps extends Omit<React.ComponentProps<"form">, 'onSubmit'> {
  onTyping: (isTyping: boolean) => void;
  onPasswordChange: (password: string) => void;
  onPasswordVisibilityChange: (isVisible: boolean) => void;
}

function AnimatedLoginForm({
  className,
  onTyping,
  onPasswordChange,
  onPasswordVisibilityChange,
  ...props
}: AnimatedLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync password visibility with parent
  useEffect(() => {
    onPasswordVisibilityChange(showPassword);
  }, [showPassword, onPasswordVisibilityChange]);

  // Sync password value with parent
  useEffect(() => {
    onPasswordChange(password);
  }, [password, onPasswordChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    if (email === USER.email && password === USER.password) {
      // console.log("✅ Login successful!");
      // alert("Login successful! Welcome, Erik!");
      redirect("/docs")
    } else {
      setError("Invalid email or password. Please try again.");
      // console.log("❌ Login failed");
    }

    setIsLoading(false);
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => onTyping(true)}
            onBlur={() => onTyping(false)}
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => onTyping(true)}
              onBlur={() => onTyping(false)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>
        </Field>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CircleX size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Spinner /> : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-5">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

function LoginPage() {
  // State lifted to parent for animation logic
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  // Derived state for eye logic
  const isPasswordVisible = password.length > 0 && showPassword;
  const isPasswordHidden = password.length > 0 && !showPassword;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect for purple character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking effect for black character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Looking at each other animation when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => {
        setIsLookingAtEachOther(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple sneaky peeking animation when password is visible
  useEffect(() => {
    if (isPasswordVisible) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => {
            setIsPurplePeeking(false);
          }, 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };

      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [isPasswordVisible, isPurplePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  // Eye position logic helpers
  const getPurpleEyeForceX = () => {
    if (isPasswordVisible) return isPurplePeeking ? 4 : -4;
    if (isLookingAtEachOther) return 3;
    return undefined;
  };

  const getPurpleEyeForceY = () => {
    if (isPasswordVisible) return isPurplePeeking ? 5 : -4;
    if (isLookingAtEachOther) return 4;
    return undefined;
  };

  const getBlackEyeForceX = () => {
    if (isPasswordVisible) return -4;
    if (isLookingAtEachOther) return 0;
    return undefined;
  };

  const getBlackEyeForceY = () => {
    if (isPasswordVisible) return -4;
    if (isLookingAtEachOther) return -4;
    return undefined;
  };

  const getOrangeYellowForceX = () => {
    if (isPasswordVisible) return -5;
    return undefined;
  };

  const getOrangeYellowForceY = () => {
    if (isPasswordVisible) return -4;
    return undefined;
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Content Section with Animations */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground">
        {/* <div className="relative z-20">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="size-8 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <span>YourBrand</span>
          </div>
        </div> */}

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          {/* Cartoon Characters */}
          <div className="relative" style={{ width: '550px', height: '400px' }}>

            {/* Purple tall rectangle character with graduation cap - Back layer */}
            <div
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px',
                width: '180px',
                height: (isTyping || isPasswordHidden) ? '440px' : '400px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: isPasswordVisible
                  ? `skewX(0deg)`
                  : (isTyping || isPasswordHidden)
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Graduation Cap */}
              <GraduationCap color="#2D2D2D" />

              {/* Eyes */}
              <div
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: isPasswordVisible ? '20px' : isLookingAtEachOther ? '55px' : `${45 + purplePos.faceX}px`,
                  top: isPasswordVisible ? '35px' : isLookingAtEachOther ? '65px' : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={5}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={getPurpleEyeForceX()}
                  forceLookY={getPurpleEyeForceY()}
                />
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={5}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={getPurpleEyeForceX()}
                  forceLookY={getPurpleEyeForceY()}
                />
              </div>
            </div>

            {/* Black tall rectangle character - Middle layer */}
            <div
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: isPasswordVisible
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || isPasswordHidden)
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >

              {/* Graduation Cap */}
              <GraduationCap color="#2D2D2D" />

              {/* Eyes */}
              <div
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: isPasswordVisible ? '10px' : isLookingAtEachOther ? '32px' : `${26 + blackPos.faceX}px`,
                  top: isPasswordVisible ? '28px' : isLookingAtEachOther ? '12px' : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall
                  size={16}
                  pupilSize={6}
                  maxDistance={4}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={getBlackEyeForceX()}
                  forceLookY={getBlackEyeForceY()}
                />
                <EyeBall
                  size={16}
                  pupilSize={6}
                  maxDistance={4}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={getBlackEyeForceX()}
                  forceLookY={getBlackEyeForceY()}
                />
              </div>
            </div>

            {/* Orange semi-circle character - Front left */}
            <div
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '240px',
                height: '200px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '120px 120px 0 0',
                transform: isPasswordVisible ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >

              {/* Graduation Cap */}
              <GraduationCap color="#2D2D2D" />

              {/* Eyes - just pupils, no white */}
              <div
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: isPasswordVisible ? '50px' : `${82 + (orangePos.faceX || 0)}px`,
                  top: isPasswordVisible ? '85px' : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  forceLookX={getOrangeYellowForceX()}
                  forceLookY={getOrangeYellowForceY()}
                />
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  forceLookX={getOrangeYellowForceX()}
                  forceLookY={getOrangeYellowForceY()}
                />
              </div>
            </div>

            {/* Yellow tall rectangle character - Front right */}
            <div
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '310px',
                width: '140px',
                height: '230px',
                backgroundColor: '#E8D754',
                borderRadius: '70px 70px 0 0',
                zIndex: 4,
                transform: isPasswordVisible ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >

              {/* Graduation Cap */}
              <GraduationCap color="#2D2D2D" />

              {/* Eyes - just pupils, no white */}
              <div
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: isPasswordVisible ? '20px' : `${52 + (yellowPos.faceX || 0)}px`,
                  top: isPasswordVisible ? '35px' : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  forceLookX={getOrangeYellowForceX()}
                  forceLookY={getOrangeYellowForceY()}
                />
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  forceLookX={getOrangeYellowForceX()}
                  forceLookY={getOrangeYellowForceY()}
                />
              </div>
              {/* Horizontal line for mouth */}
              <div
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: isPasswordVisible ? '10px' : `${40 + (yellowPos.faceX || 0)}px`,
                  top: isPasswordVisible ? '88px' : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        {/* <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Contact
          </a>
        </div> */}

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Right Login Section with New Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full md:max-w-[420px] max-w-xs">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <span>YourBrand</span>
          </div>

          {/* Login Form with callbacks to parent */}
          <AnimatedLoginForm
            onTyping={setIsTyping}
            onPasswordChange={setPassword}
            onPasswordVisibilityChange={setShowPassword}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;