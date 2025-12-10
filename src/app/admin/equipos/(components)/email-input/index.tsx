'use client';

import type { KeyboardEvent} from 'react';
import { useState, forwardRef } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EmailInputProps {
  value?: string[];
  onChange?: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({
    value = [],
    onChange,
    placeholder = "Escribe un email y presiona Enter", className,
  }, ref) => {
    const [emailInput, setEmailInput] = useState('');

    // Validation function
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Add email function
    const addEmail = (email: string) => {
      const trimmedEmail = email.trim();
      if (trimmedEmail && isValidEmail(trimmedEmail)) {
        if (!value.includes(trimmedEmail)) {
          onChange?.([...value, trimmedEmail]);
          setEmailInput('');
        }
      }
    };

    // Email function to remove email
    const removeEmail = (emailToRemove: string) => {
      const updatedEmails = value.filter(email => email !== emailToRemove);
      onChange?.(updatedEmails);
    };

    // Handle key presses in the email input
    const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addEmail(emailInput);
      } else if (e.key === 'Backspace' && emailInput === '') {
        // If input is empty and backspace is pressed, remove the last email
        if (value.length > 0) {
          removeEmail(value[value.length - 1]);
        }
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        {/* Input for adding new emails */}
        <Input
          ref={ref}
          type="email"
          placeholder={placeholder}
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={handleEmailKeyDown}
          onBlur={() => {
            // Add email on blur if there's input
            if (emailInput.trim()) {
              addEmail(emailInput);
            }
          }}
        />

        {/* Show emails as badges */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((email, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  },
);

EmailInput.displayName = "EmailInput";
