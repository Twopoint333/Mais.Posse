
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  business: z.string().min(2, {
    message: "Nome do estabelecimento deve ter pelo menos 2 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "Por favor insira um telefone válido.",
  }),
  businessType: z.string().min(2, {
    message: "Por favor informe o tipo do seu negócio.",
  }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business: "",
      phone: "",
      businessType: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    // Show success toast
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Em breve entraremos em contato.",
    });
    
    // Note: ClickUp integration will be added later
    console.log("Form data for ClickUp integration:", data);
    
    // Reset form after submission
    form.reset();
    
    // Redirect to thank you page
    navigate('/obrigado');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do estabelecimento</FormLabel>
              <FormControl>
                <Input placeholder="Nome do seu estabelecimento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone/WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual o tipo do seu negócio?</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Restaurante, Lanchonete, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva sua mensagem aqui"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-[#A21C1C] hover:bg-[#911616] transition-colors duration-300 shadow-md hover:shadow-lg">
          Enviar
        </Button>
      </form>
      
      <div className="text-xs text-center mt-4 text-gray-500">
        © Mais Delivery Oeste da Bahia e Washington - Oesteframelab
      </div>
    </Form>
  );
};
