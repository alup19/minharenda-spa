import React, { useState, useEffect } from "react";
import { Camera, User, Mail, Phone, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { toast } from "sonner";
import { useUsuarioStore } from "./context/UsuarioContext.js";

const apiUrl = import.meta.env.VITE_API_URL;

type UsuarioApi = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  celular: string;
};

export default function UsuarioConfig() {
  const { usuario } = useUsuarioStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: usuario?.nome ?? "",
    email: usuario?.email ?? "",
    phone: usuario?.celular ?? "",
    cpf: usuario?.cpf ?? "",
    password: "",
    confirmPassword: "",
  });

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = formData.name || usuario?.nome || "Usuário";

  useEffect(() => {
    if (!usuario?.id) return;

    const carregarUsuario = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetch(`${apiUrl}/usuarios/${usuario.id}`, {
          headers: usuario.token
            ? { Authorization: `Bearer ${usuario.token}` }
            : {},
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar dados do usuário");
        }

        const data: UsuarioApi = await response.json();

        setFormData(prev => ({
          ...prev,
          name: data.nome ?? prev.name,
          email: data.email ?? prev.email,
          phone: data.celular ?? prev.phone,
          cpf: data.cpf ?? prev.cpf,
          password: "",
          confirmPassword: "",
        }));
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar seus dados de usuário.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    carregarUsuario();
  }, [usuario?.id, usuario?.token]);

  const handleSave = async () => {
    if (!usuario?.id) {
      toast.error("Usuário não identificado. Faça login novamente.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Informe o seu nome completo.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Informe o seu e-mail.");
      return;
    }

    if (!formData.cpf.trim() || formData.cpf.length !== 11) {
      toast.error("CPF inválido nos dados do usuário.");
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 11) {
      toast.error("Celular deve conter pelo menos 11 dígitos (somente números).");
      return;
    }

    if (!formData.password) {
      toast.error("Para atualizar seus dados, informe uma nova senha.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("A confirmação de senha não confere.");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        nome: formData.name.trim(),
        email: formData.email.trim(),
        senha: formData.password,
        cpf: formData.cpf.trim(),
        celular: formData.phone.trim(),
      };

      const response = await fetch(`${apiUrl}/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario.token
            ? { Authorization: `Bearer ${usuario.token}` }
            : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const erro = await response.json().catch(() => null);
        console.error("Erro ao atualizar usuário:", erro);
        if (erro?.erro) {
          if (Array.isArray(erro.erro)) {
            toast.error(erro.erro.join(" • "));
          } else if (erro.erro.message) {
            toast.error("Erro de validação nos dados enviados.");
          } else {
            toast.error("Erro ao salvar alterações. Verifique os dados informados.");
          }
        } else {
          toast.error("Erro ao salvar alterações. Verifique os dados informados.");
        }
        return;
      }

      const usuarioAtualizado: UsuarioApi = await response.json();

      setFormData(prev => ({ ...prev, name: usuarioAtualizado.nome ?? prev.name, email: usuarioAtualizado.email ?? prev.email, phone: usuarioAtualizado.celular ?? prev.phone, cpf: usuarioAtualizado.cpf ?? prev.cpf, password: "", confirmPassword: "", }));

      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 font-inter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Configurações
        </h1>
        <p className="text-gray-500 mt-2">
          Gerencie as informações do seu perfil.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-2 text-sm text-gray-600">
          <button className="text-left px-4 py-2 bg-[#F0FDF4] text-[#2E8B57] font-medium rounded-md transition-colors">
            Geral
          </button>
          <button className="text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors">
            Planos
          </button>
          <button className="text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors text-red-600 hover:text-red-700">
            Sair
          </button>
        </nav>

        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize seus dados visíveis na plataforma.</CardDescription>
            </CardHeader>

            <Separator className="bg-gray-100" />

            <CardContent className="space-y-8 pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src="" alt="Foto de perfil" />
                    <AvatarFallback className="bg-[#2E8B57] text-white text-3xl font-bold tracking-widest">{getInitials(displayName)}</AvatarFallback>
                  </Avatar>

                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-medium text-gray-900">Sua Foto</h3>
                  <p className="text-sm text-gray-500">
                    Clique na foto para alterar.
                  </p>
                </div>
              </div>

              {isInitialLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando seus dados...
                </div>
              ) : (
                <>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-gray-700">
                        Nome Completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input id="name" name="name" className="pl-10 border-gray-300 focus-visible:ring-[#2E8B57]" value={formData.name} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input id="email" name="email" type="email" className="pl-10 border-gray-300 focus-visible:ring-[#2E8B57]" value={formData.email} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-gray-700">
                          Celular (somente números)
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input id="phone" name="phone" className="pl-10 border-gray-300 focus-visible:ring-[#2E8B57]" value={formData.phone} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="password" className="text-gray-700">
                          Nova Senha
                        </Label>
                        <Input id="password" name="password" type="password" className="border-gray-300 focus-visible:ring-[#2E8B57]" value={formData.password} onChange={handleChange} placeholder="Informe uma nova senha" />
                        <span className="text-xs text-gray-500">
                          Mínimo 8 caracteres, com maiúsculas, minúsculas,
                          números e símbolos.
                        </span>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword" className="text-gray-700">
                          Confirmar Senha
                        </Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" className="border-gray-300 focus-visible:ring-[#2E8B57]" value={formData.confirmPassword} onChange={handleChange} placeholder="Repita a nova senha" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <Separator className="bg-gray-100" />

            <CardFooter className="flex justify-end py-4 bg-gray-50/50">
              <Button onClick={handleSave} disabled={isLoading || isInitialLoading} className="bg-[#2E8B57] hover:bg-[#246e45] text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />Salvar Alterações</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
