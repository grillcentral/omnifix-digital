import { useQuery } from "@tanstack/react-query";
import {
  getAgendamentos,
  getBlogPosts,
  getBlogPostById,
  getEstoque,
  getEstoqueCritico,
  getFeaturedProducts,
  getLeads,
  getLeadsByStage,
  getOrdemServicoById,
  getOrdensServico,
  getProducts,
  getTestimonials,
} from "../api/client";
import { queryKeys } from "@/lib/queryKeys.js";

export const useProducts = () =>
  useQuery({ queryKey: queryKeys.products, queryFn: getProducts });

export const useFeaturedProducts = () =>
  useQuery({ queryKey: queryKeys.featuredProducts, queryFn: getFeaturedProducts });

export const useTestimonials = () =>
  useQuery({ queryKey: queryKeys.testimonials, queryFn: getTestimonials });

export const useBlogPosts = () =>
  useQuery({ queryKey: queryKeys.blogPosts, queryFn: getBlogPosts });

export const useBlogPost = (id) =>
  useQuery({
    queryKey: queryKeys.blogPost(id),
    queryFn: () => getBlogPostById(id),
    enabled: Boolean(id),
  });

export const useOrdensServico = () =>
  useQuery({ queryKey: queryKeys.ordensServico, queryFn: getOrdensServico });

export const useOrdemServico = (id) =>
  useQuery({
    queryKey: queryKeys.ordemServico(id),
    queryFn: () => getOrdemServicoById(id),
    enabled: Boolean(id),
  });

export const useLeads = () =>
  useQuery({ queryKey: queryKeys.leads, queryFn: getLeads });

export const useLeadsByStage = (stage) =>
  useQuery({
    queryKey: queryKeys.leadsByStage(stage),
    queryFn: () => getLeadsByStage(stage),
    enabled: Boolean(stage),
  });

export const useEstoque = () =>
  useQuery({ queryKey: queryKeys.estoque, queryFn: getEstoque });

export const useEstoqueCritico = () =>
  useQuery({ queryKey: queryKeys.estoqueCritico, queryFn: getEstoqueCritico });

export const useAgendamentos = () =>
  useQuery({ queryKey: queryKeys.agendamentos, queryFn: getAgendamentos });
