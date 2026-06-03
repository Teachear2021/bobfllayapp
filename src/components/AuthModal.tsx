import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Por favor, insira um telefone válido com DDD");
      return;
    }

    setLoading(true);
    // Format to E.164
    const formattedPhone = phone.startsWith("+") ? phone : `+55${phone.replace(/\D/g, "")}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setStep("otp");
      toast.success("Código enviado por SMS!");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formattedPhone = phone.startsWith("+") ? phone : `+55${phone.replace(/\D/g, "")}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    setLoading(false);
    if (error) {
      toast.error("Código inválido ou expirado");
    } else {
      toast.success("Bem-vindo!");
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center px-4 pb-4 sm:p-0">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm overflow-hidden rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            {step === "phone" ? <Phone className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {step === "phone" ? "Entre com seu telefone" : "Verifique seu código"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "phone" 
              ? "Sem senha, rápido e seguro. Enviaremos um SMS." 
              : `Enviamos um código para ${phone}`}
          </p>
        </div>

        <form onSubmit={step === "phone" ? handleSendOtp : handleVerifyOtp} className="mt-6 space-y-4">
          {step === "phone" ? (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Telefone (com DDD)</label>
              <input
                autoFocus
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl bg-secondary/50 border border-border px-4 text-base outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">Código de 6 dígitos</label>
              <input
                autoFocus
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-12 rounded-xl bg-secondary/50 border border-border px-4 text-center text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setStep("phone")}
                className="w-full mt-2 text-xs text-primary font-medium"
              >
                Mudar número de telefone
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary h-12 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                {step === "phone" ? "Enviar código" : "Confirmar e entrar"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        
        <button 
          onClick={onClose}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Talvez mais tarde
        </button>
      </div>
    </div>
  );
}
