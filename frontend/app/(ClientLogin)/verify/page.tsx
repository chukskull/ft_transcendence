"use client";
import { promises } from "dns";
import style from "@/styles/components/TwoFa.module.scss";
import React, { useEffect, useRef, useReducer, Key } from "react";
import { Button } from "@nextui-org/react";

function doSubmit(submittedValues: string[]) {
  return new Promise((resolve): void => {
    setTimeout(() => {
      console.log(submittedValues.join(""));
      resolve(0);
    }, 1500);
  });
}

interface PayloadType {
  index: number;
  value: any;
}

interface ActionType {
  type: string;
  payload: PayloadType;
}

function clampIndex(index: number, min: number = 0, max: number = 10): number {
  return Math.max(Math.min(index, max), min);
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "INPUT":
      return {
        ...state,
        inputValues: [
          ...state.inputValues.slice(0, action.payload.index),
          action.payload.value,
          ...state.inputValues.slice(action.payload.index + 1),
        ],
        focusedIndex: clampIndex(state.focusedIndex + 1),
      };

    case "BACK":
      return {
        ...state,
        focusedIndex: clampIndex(state.focusedIndex - 1),
      };

    case "PASTE":
      return {
        ...state,
        inputValues: state.inputValues.map(
          (_: any, index: number) => action.payload.pastedValue[index] || ""
        ),
      };

    case "FOCUS":
      return {
        ...state,
        focusedIndex: action.payload.focusedIndex,
      };

    case "VERIFY":
      return {
        ...state,
        status: "pending",
      };

    case "VERIFY_SUCCESS":
      return {
        ...state,
        status: "idle",
      };

    default:
      throw new Error("unknown action");
  }
}

const initialState = {
  inputValues: Array(6).fill(""),
  focusedIndex: 0,
  status: "idle",
};
export default function VerifyPage() {
  const [{ inputValues, focusedIndex, status }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function handleInput(index: number, value: string) {
    dispatch({ type: "INPUT", payload: { index, value } });
  }

  function handleBack() {
    dispatch({ type: "BACK" });
  }

  function handlePaste(pastedValue: string) {
    dispatch({ type: "PASTE", payload: { pastedValue } });

    if (pastedValue.length === 6) {
      dispatch({ type: "VERIFY" });
      doSubmit(pastedValue.split("")).then(() =>
        dispatch({ type: "VERIFY_SUCCESS" })
      );
    }
  }

  function handleFocus(focusedIndex: number) {
    dispatch({ type: "FOCUS", payload: { focusedIndex } });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    dispatch({ type: "VERIFY" });
    doSubmit(inputValues).then(() => dispatch({ type: "VERIFY_SUCCESS" }));
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div
        className={`${style["rectangle"]} flex flex-col items-center justify-center gap-7   `}
      >
        {/* <h1 className="text-center text-fontlight font-ClashGrotesk-Medium text-3xl">
          Authenticate Your Account
        </h1> */}
        <form className={style["form"]} onSubmit={handleSubmit}>
          <div className={style["inputs"]}>
            {inputValues.map((value: any, index: any) => {
              return (
                <Input
                  key={index}
                  index={index}
                  value={value}
                  onChange={handleInput}
                  onBackspace={handleBack}
                  onPaste={handlePaste}
                  isFocused={index === focusedIndex}
                  onFocus={handleFocus}
                  isDisabled={status === "pending"}
                />
              );
            })}
          </div>
          <Button
            type="submit"
            className={`w-full  text-base text-fontlight font-ClashGrotesk-Medium h-12 ${style["button"]}`}
            disabled={status === "pending"}
          >
            {status === "pending" ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}

interface InputProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onPaste: (pastedValue: string) => void;
  onBackspace: () => void;
  isFocused: boolean;
  onFocus: (index: number) => void;
  isDisabled: boolean;
}

function Input({
  index,
  value,
  onChange,
  onPaste,
  onBackspace,
  isFocused,
  onFocus,
  isDisabled,
}: InputProps) {
  const ref: any = useRef();
  useEffect(() => {
    requestAnimationFrame(() => {
      if (ref.current !== document.activeElement && isFocused) {
        ref?.current.focus();
      }
    });
  }, [isFocused]);

  function handleChange(e: any) {
    onChange(index, e?.target?.value);
  }

  function handlePaste(e: any) {
    onPaste(e?.clipboardData?.getData("text"));
  }

  function handleKeyDown(e: any) {
    if (e?.key === "Backspace") {
      onBackspace();
    }
  }

  function handleFocus(e: any) {
    e.target.setSelectionRange(0, 1);
    onFocus(index);
  }

  return (
    <input
      className={`${style["input"]} + text-fontlight`}
      ref={ref}
      type="text"
      value={value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onPaste={handlePaste}
      maxLength={1}
      onFocus={handleFocus}
      disabled={isDisabled}
    />
  );
}
