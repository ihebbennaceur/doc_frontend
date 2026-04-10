'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Translations = {
  // Navigation
  'nav.entrar': { pt: 'Entrar', en: 'Login' },
  'nav.comecar': { pt: 'Começar', en: 'Get Started' },
  'nav.home': { pt: 'Início', en: 'Home' },
  'nav.precos': { pt: 'Preços', en: 'Pricing' },
  'nav.dashboard': { pt: 'Dashboard', en: 'Dashboard' },
  'nav.doccheck': { pt: 'DocCheck', en: 'DocCheck' },
  'nav.documentos': { pt: 'Documentos', en: 'Documents' },
  'nav.cma': { pt: 'CMA', en: 'CMA Report' },
  'nav.pedidos': { pt: 'Pedidos', en: 'Orders' },
  'nav.perfil': { pt: 'Perfil', en: 'Profile' },
  'nav.definicoes': { pt: 'Definições', en: 'Settings' },
  'nav.operator': { pt: 'Operador', en: 'Operator' },
  'nav.logout': { pt: 'Sair', en: 'Logout' },

  // Auth
  'auth.entrar': { pt: 'Entrar', en: 'Sign In' },
  'auth.aceda': { pt: 'Aceda à sua conta Fizbo', en: 'Access your Fizbo account' },
  'auth.email': { pt: 'Email', en: 'Email' },
  'auth.password': { pt: 'Palavra-passe', en: 'Password' },
  'auth.entering': { pt: 'A entrar...', en: 'Signing in...' },
  'auth.noaccount': { pt: 'Não tem conta?', en: 'Don\'t have an account?' },
  'auth.registar': { pt: 'Registar-se', en: 'Sign Up' },
  'auth.criar': { pt: 'Criar Conta', en: 'Create Account' },
  'auth.juntese': { pt: 'Junte-se à plataforma Fizbo', en: 'Join the Fizbo platform' },
  'auth.confirmPassword': { pt: 'Confirmar Palavra-passe', en: 'Confirm Password' },
  'auth.passwordMatch': { pt: 'As palavras-passe não correspondem', en: 'Passwords do not match' },
  'auth.passwordMin': { pt: 'A palavra-passe deve ter pelo menos 8 caracteres', en: 'Password must be at least 8 characters' },
  'auth.registering': { pt: 'A registar...', en: 'Creating account...' },
  'auth.temconta': { pt: 'Já tem conta?', en: 'Already have an account?' },
  'auth.error': { pt: 'Falha ao conectar ao servidor. Tente novamente.', en: 'Failed to connect to server. Please try again.' },

  // Home
  'home.hero': { pt: 'Venda o seu imóvel com todos os documentos em ordem.', en: 'Sell your property with all documents in order.' },
  'home.heroSub': { pt: 'Tratamos de tudo — da caderneta ao certificado energético. Venda com confiança, sem caos burocrático.', en: 'We handle everything — from property records to energy certificates. Sell with confidence, no bureaucratic chaos.' },
  'home.verificar': { pt: 'Verificar os meus documentos', en: 'Check My Documents' },
  'home.comofunciona': { pt: 'Ver como funciona', en: 'See How It Works' },
  'home.propriedades': { pt: 'Propriedades documentadas', en: 'Properties documented' },
  'home.certificados': { pt: 'Certificados energéticos', en: 'Energy certificates' },
  'home.satisfacao': { pt: 'Satisfação de clientes', en: 'Customer satisfaction' },
  'home.comoFunciona': { pt: 'Como funciona', en: 'How It Works' },
  'home.passo1': { pt: 'Verifique o que falta', en: 'Check What\'s Missing' },
  'home.desc1': { pt: 'Responda a 8 perguntas simples e saiba exatamente que documentos precisa.', en: 'Answer 8 simple questions and know exactly which documents you need.' },
  'home.passo2': { pt: 'Nós tratamos de tudo', en: 'We Handle Everything' },
  'home.desc2': { pt: 'Coordenamos com câmaras, peritos e cartórios. Você não faz nada.', en: 'We coordinate with municipalities, experts, and notaries. You do nothing.' },
  'home.passo3': { pt: 'Venda com confiança', en: 'Sell with Confidence' },
  'home.desc3': { pt: 'Todos os documentos prontos, validados e entregues. Venda rápido e com segurança.', en: 'All documents ready, validated, and delivered. Sell fast and secure.' },
  'home.escolha': { pt: 'Escolha o plano ideal para si', en: 'Choose the Perfect Plan for You' },
  'home.clientes': { pt: 'O que os nossos clientes dizem', en: 'What Our Customers Say' },
  'home.pronto': { pt: 'Pronto para vender com confiança?', en: 'Ready to Sell with Confidence?' },
  'home.comece': { pt: 'Comece agora com uma avaliação gratuita do que falta.', en: 'Start now with a free assessment of what\'s missing.' },
  'home.copyright': { pt: '© 2026 Fizbo · AMI 123456', en: '© 2026 Fizbo · AMI 123456' },

  // Pricing
  'pricing.titulo': { pt: 'Preços Transparentes', en: 'Transparent Pricing' },
  'pricing.standard': { pt: 'Standard', en: 'Standard' },
  'pricing.premium': { pt: 'Premium', en: 'Premium' },
  'pricing.docexpress': { pt: 'DocExpress', en: 'DocExpress' },
  'pricing.popular': { pt: 'MAIS POPULAR', en: 'MOST POPULAR' },
  'pricing.unico': { pt: '(único)', en: '(one-time)' },
  'pricing.faq': { pt: 'Perguntas Frequentes', en: 'Frequently Asked Questions' },
  'pricing.trust': { pt: 'Confiança & Segurança', en: 'Trust & Security' },

  // DocCheck
  'doccheck.titulo': { pt: 'Document Check Assessment', en: 'Document Check Assessment' },
  'doccheck.sub': { pt: 'Get a free assessment of the documents required for your property sale', en: 'Obtenha uma avaliação gratuita dos documentos necessários para vender sua propriedade' },
  'doccheck.info': { pt: 'Property Information', en: 'Property Information' },
  'doccheck.submit': { pt: 'Iniciar Avaliação', en: 'Start Assessment' },
  'doccheck.resultado': { pt: 'Resultado da Avaliação', en: 'Assessment Result' },
  'doccheck.error': { pt: 'Error starting assessment', en: 'Error starting assessment' },

  // Dashboard
  'dashboard.dashboard': { pt: 'Dashboard', en: 'Dashboard' },
  'dashboard.pedidos': { pt: 'Pedidos Totais', en: 'Total Orders' },
  'dashboard.pendentes': { pt: 'Pendentes', en: 'Pending' },
  'dashboard.completos': { pt: 'Completos', en: 'Completed' },
  'dashboard.gasto': { pt: 'Total Gasto', en: 'Total Spent' },
  'dashboard.recentes': { pt: 'Pedidos Recentes', en: 'Recent Orders' },
  'dashboard.acoes': { pt: 'Ações Rápidas', en: 'Quick Actions' },
  'dashboard.suporte': { pt: 'Suporte', en: 'Support' },
  'dashboard.contactar': { pt: 'Contacte-nos por email', en: 'Contact us by email' },

  // Profile
  'profile.myperfil': { pt: 'My Profile', en: 'My Profile' },
  'profile.gerir': { pt: 'Manage your account information', en: 'Manage your account information' },
  'profile.info': { pt: 'Profile Information', en: 'Profile Information' },
  'profile.editar': { pt: 'Edit Profile', en: 'Edit Profile' },
  'profile.nome': { pt: 'Full Name', en: 'Full Name' },
  'profile.email': { pt: 'Email Address', en: 'Email Address' },
  'profile.telefone': { pt: 'Phone Number', en: 'Phone Number' },
  'profile.role': { pt: 'Account Role', en: 'Account Role' },
  'profile.desde': { pt: 'Member Since', en: 'Member Since' },
  'profile.nao': { pt: 'N/A', en: 'N/A' },
  'profile.fornecido': { pt: 'Not provided', en: 'Not provided' },
  'profile.seller': { pt: 'Seller', en: 'Seller' },
  'profile.atualizado': { pt: 'Profile updated successfully', en: 'Profile updated successfully' },

  // Dashboard - Recent Orders & Actions
  'dashboard.recentOrders': { pt: 'Pedidos Recentes', en: 'Recent Orders' },
  'dashboard.viewAll': { pt: 'Ver Tudo →', en: 'View All →' },
  'dashboard.orderNo': { pt: 'Pedido #', en: 'Order #' },
  'dashboard.plan': { pt: 'Plano', en: 'Plan' },
  'dashboard.noOrders': { pt: 'Sem pedidos ainda', en: 'No orders yet' },
  'dashboard.quickActions': { pt: 'Ações Rápidas', en: 'Quick Actions' },
  'dashboard.assessment': { pt: 'Avaliação', en: 'Assessment' },
  'dashboard.documents': { pt: 'Documentos', en: 'Documents' },
  'dashboard.cmaReport': { pt: 'Relatório CMA', en: 'CMA Report' },
  'dashboard.needHelp': { pt: 'Precisa de Ajuda?', en: 'Need Help?' },
  'dashboard.supportText': { pt: 'Nossa equipe de suporte está pronta para ajudar.', en: 'Our support team is ready to assist you.' },
  'dashboard.contactSupport': { pt: 'Contactar Suporte →', en: 'Contact Support →' },

  // DocCheck Page
  'doccheck.backToDash': { pt: '← Voltar ao Dashboard', en: '← Back to Dashboard' },
  'doccheck.title': { pt: 'Avaliação de Verificação de Documentos', en: 'Document Check Assessment' },
  'doccheck.subtitle': { pt: 'Obtenha uma avaliação gratuita dos documentos necessários para a venda da sua propriedade', en: 'Get a free assessment of the documents required for your property sale' },
  'doccheck.propertyInfo': { pt: 'Informações da Propriedade', en: 'Property Information' },
  'doccheck.email': { pt: 'Endereço de Email', en: 'Email Address' },
  'doccheck.emailPlaceholder': { pt: 'o.seu@email.com', en: 'your@email.com' },
  'doccheck.propertyType': { pt: 'Tipo de Propriedade', en: 'Property Type' },
  'doccheck.selectType': { pt: 'Selecione o tipo de propriedade', en: 'Select property type' },
  'doccheck.apartment': { pt: 'Apartamento', en: 'Apartment' },
  'doccheck.house': { pt: 'Casa', en: 'House' },
  'doccheck.land': { pt: 'Terreno', en: 'Land' },
  'doccheck.commercial': { pt: 'Comercial', en: 'Commercial' },
  'doccheck.location': { pt: 'Localização', en: 'Location' },
  'doccheck.locationPlaceholder': { pt: 'Cidade ou região', en: 'City or region' },
  'doccheck.mortgaged': { pt: 'Propriedade hipotecada', en: 'Property is mortgaged' },
  'doccheck.inherited': { pt: 'Propriedade herdada', en: 'Property is inherited' },
  'doccheck.getAssessment': { pt: 'Obter Avaliação', en: 'Get Assessment' },
  'doccheck.assessing': { pt: 'Avaliando...', en: 'Assessing...' },
  'doccheck.results': { pt: 'Resultados da Avaliação', en: 'Assessment Results' },
  'doccheck.recommendedPlan': { pt: 'Plano Recomendado', en: 'Recommended Plan' },
  'doccheck.estimatedCost': { pt: 'Custo Estimado', en: 'Estimated Cost' },
  'doccheck.timeline': { pt: 'Cronograma', en: 'Timeline' },
  'doccheck.days': { pt: 'dias', en: 'days' },
  'doccheck.documentsRequired': { pt: 'Documentos Necessários', en: 'Documents Required' },
  'doccheck.noDocuments': { pt: 'Nenhum documento específico necessário', en: 'No specific documents needed' },
  'doccheck.startService': { pt: 'Iniciar Serviço', en: 'Start Service' },
  'doccheck.proceedToOrder': { pt: 'Proceder para Encomenda', en: 'Proceed to Order' },
  'doccheck.enhanced.results.freeTier': { pt: 'Avaliação Gratuita', en: 'Free Assessment' },

  // DocCheck Personas
  'doccheck.persona.urban_resident.name': { pt: 'Vendedor Urbano', en: 'Urban Seller' },
  'doccheck.persona.urban_resident.description': { pt: 'Residente em Portugal com documentação direta e previsível.', en: 'Portugal resident with straightforward and predictable documentation.' },
  'doccheck.persona.non_resident.name': { pt: 'Vendedor Não-residente', en: 'Non-Resident Seller' },
  'doccheck.persona.non_resident.description': { pt: 'Vive fora de Portugal e precisa de representação e fiscalidade alinhada.', en: 'Lives outside Portugal and needs aligned representation and tax handling.' },
  'doccheck.persona.heir.name': { pt: 'Coordenador de Herança', en: 'Heir Coordinator' },
  'doccheck.persona.heir.description': { pt: 'Processo com múltiplos herdeiros ou documentação sucessória em aberto.', en: 'Process with multiple heirs or outstanding succession paperwork.' },
  'doccheck.persona.divorce.name': { pt: 'Venda em Divórcio', en: 'Divorce Sale' },
  'doccheck.persona.divorce.description': { pt: 'Venda partilhada entre ex-cônjuges exigindo coordenação jurídica rápida.', en: 'Sale shared between ex-spouses that demands fast legal coordination.' },
  'doccheck.persona.rural.name': { pt: 'Proprietário Rural', en: 'Rural Owner' },
  'doccheck.persona.rural.description': { pt: 'Imóvel antigo ou terreno rústico com requisitos adicionais.', en: 'Older property or rural land with additional requirements.' },

  // DocCheck Documents
  'doccheck.documents.caderneta_predial': { pt: 'Caderneta Predial Urbana', en: 'Urban Property Registry' },
  'doccheck.documents.certidao_permanente': { pt: 'Certidão Permanente do Registo Predial', en: 'Permanent Land Registry Certificate' },
  'doccheck.documents.licenca_utilizacao': { pt: 'Licença de Utilização', en: 'Usage License' },
  'doccheck.documents.ficha_tecnica_habitacao': { pt: 'Ficha Técnica da Habitação', en: 'Housing Technical File' },
  'doccheck.documents.certificado_energetico': { pt: 'Certificado Energético', en: 'Energy Certificate' },
  'doccheck.documents.declaracao_condominio': { pt: 'Declaração do Condomínio', en: 'Condominium Statement' },
  'doccheck.documents.distrate_hipoteca': { pt: 'Distrate de Hipoteca', en: 'Mortgage Discharge' },
  'doccheck.documents.habilitacao_herdeiros': { pt: 'Habilitação de Herdeiros', en: 'Heirs Qualification Deed' },

  // DocCheck Risk Flags
  'doccheck.risk.old_property.message': { pt: 'Propriedade com mais de 70 anos — pode ter exigências regulamentares.', en: 'Property over 70 years old — may have regulatory requirements.' },
  'doccheck.risk.old_property.recommendation': { pt: 'Recomendamos inspeção Simplex Safe.', en: 'Recommend a Simplex Safe inspection.' },
  'doccheck.risk.low_energy_rating.message': { pt: 'Classe energética {{value}} — pode afetar o financiamento do comprador.', en: 'Energy class {{value}} — may affect buyer financing.' },
  'doccheck.risk.low_energy_rating.recommendation': { pt: 'Sugestão: atualizar o certificado energético.', en: 'Suggestion: update the energy certificate.' },
  'doccheck.risk.inheritance_complexity.message': { pt: 'Vários herdeiros ou questões legais em aberto.', en: 'Multiple heirs or pending legal issues.' },
  'doccheck.risk.inheritance_complexity.recommendation': { pt: 'Recomenda-se revisão jurídica e habilitação de herdeiros.', en: 'Recommend legal review and heirs qualification.' },
  'doccheck.risk.disputed_ownership.message': { pt: 'Propriedade em disputa — ação legal necessária.', en: 'Disputed ownership — legal action required.' },
  'doccheck.risk.disputed_ownership.recommendation': { pt: 'Resolver o litígio antes de avançar com a venda.', en: 'Resolve the dispute before proceeding with the sale.' },
  'doccheck.risk.overseas_owner.message': { pt: 'Um proprietário no estrangeiro — pode exigir procuração.', en: 'One owner abroad — may require power of attorney.' },
  'doccheck.risk.overseas_owner.recommendation': { pt: 'Garantir procuração válida e reconhecida.', en: 'Ensure the power of attorney is valid and notarized.' },

  // Document Manager (Dashboard)
  'documentManager.title': { pt: 'Documentos', en: 'Documents' },
  'documentManager.count': { pt: 'Documentos ({count})', en: 'Documents ({count})' },
  'documentManager.agentMode': { pt: '👨‍💼 Modo Agente', en: '👨‍💼 Agent Mode' },
  'documentManager.noDocs': { pt: 'Nenhum documento ainda. Os documentos aparecerão aqui quando criados.', en: 'No documents yet. Documents will appear here when they are created.' },
  'documentManager.upload': { pt: 'Carregar Documento', en: 'Upload Document' },
  'documentManager.view': { pt: 'Ver Documento', en: 'View Document' },
  'documentManager.expires': { pt: 'Expira em', en: 'Expires in' },
  'documentManager.expired': { pt: 'Expirado', en: 'Expired' },
  'documentManager.status.pending': { pt: 'Pendente', en: 'Pending' },
  'documentManager.status.processing': { pt: 'Processando', en: 'Processing' },
  'documentManager.status.uploaded': { pt: 'Carregado', en: 'Uploaded' },
  'documentManager.status.extracted': { pt: 'Extraído (Aguardando Revisão)', en: 'Extracted (Awaiting Review)' },
  'documentManager.status.verified': { pt: 'Verificado', en: 'Verified' },
  'documentManager.status.rejected': { pt: 'Rejeitado', en: 'Rejected' },
  'documentManager.status.expired': { pt: 'Expirado', en: 'Expired' },
  'documentManager.uploaded': { pt: 'Carregado em', en: 'Uploaded on' },
  'documentManager.rejectionReason': { pt: 'Motivo da Rejeição:', en: 'Rejection Reason:' },
  'documentManager.dragDrop': { pt: 'Arraste o ficheiro aqui ou clique para selecionar', en: 'Drag file here or click to select' },
  'documentManager.dragOrClick': { pt: 'Arraste o ficheiro aqui ou clique para selecionar', en: 'Drag file here or click to select' },
  'documentManager.supportedFormats': { pt: 'Formatos suportados: PDF, JPG, PNG, TIFF', en: 'Supported formats: PDF, JPG, PNG, TIFF' },
  'documentManager.changeStatus': { pt: 'Alterar Estado', en: 'Change Status' },
  'documentManager.updating': { pt: 'Atualizando...', en: 'Updating...' },
  'documentManager.uploadSuccess': { pt: 'Documento carregado com sucesso!', en: 'Document uploaded successfully!' },
  'documentManager.uploadError': { pt: 'Erro ao carregar documento', en: 'Error uploading document' },
  'documentManager.statusSuccess': { pt: 'Estado do documento atualizado!', en: 'Document status updated!' },
  'documentManager.noFile': { pt: 'Sem ficheiro', en: 'No file' },
  'documentManager.uploading': { pt: 'A carregar...', en: 'Uploading...' },
  'documentManager.waitingForExtraction': { pt: 'À espera de extração AI...', en: 'Waiting for AI extraction...' },
  'documentManager.extracting': { pt: 'A extrair dados com IA...', en: 'Extracting data with AI...' },
  'documentManager.extractionFailed': { pt: 'Falha na extração - Revisão manual necessária', en: 'Extraction failed - Manual review needed' },
  'documentManager.needsReview': { pt: 'Requer revisão manual do operador', en: 'Requires manual operator review' },
  'documentManager.clarity.clear': { pt: 'Claro', en: 'Clear' },
  'documentManager.clarity.partial': { pt: 'Parcial', en: 'Partial' },
  'documentManager.clarity.unclear': { pt: 'Pouco Claro', en: 'Unclear' },
  'documentManager.clarity.not_assessed': { pt: 'Não Avaliado', en: 'Not Assessed' },
  'documentManager.validity.valid': { pt: 'Válido', en: 'Valid' },
  'documentManager.validity.expired': { pt: 'Expirado', en: 'Expired' },
  'documentManager.validity.invalid': { pt: 'Inválido', en: 'Invalid' },
  'documentManager.validity.not_assessed': { pt: 'Não Avaliado', en: 'Not Assessed' },
  'documentManager.statusError': { pt: 'Erro ao atualizar estado', en: 'Error updating status' },

  // Document Types
  'docType.caderneta': { pt: 'Caderneta Informática', en: 'Property Registry' },
  'docType.certidao': { pt: 'Certidão de Propriedade', en: 'Property Certificate' },
  'docType.energy_cert': { pt: 'Certificado Energético', en: 'Energy Certificate' },
  'docType.certidao_propriedade': { pt: 'Certidão de Propriedade', en: 'Property Title Deed' },
  'docType.nif': { pt: 'Número de Identificação Fiscal', en: 'Tax ID Number' },
  'docType.passport': { pt: 'Passaporte', en: 'Passport' },

  // Document Names (full descriptions)
  'docName.caderneta': { pt: 'Caderneta Informática (2024-2025)', en: 'Property Registry (2024-2025)' },
  'docName.certidao': { pt: 'Certidão de Propriedade - Imóvel Lisboa', en: 'Property Certificate - Lisbon Property' },
  'docName.energy_cert': { pt: 'Certificado Energético - Loja Porto', en: 'Energy Certificate - Porto Store' },

  // Agent Dashboard
  'agent.dashboard': { pt: 'Painel do Agente', en: 'Agent Dashboard' },
  'agent.assignedCases': { pt: 'Casos Atribuídos', en: 'Assigned Cases' },
  'agent.caseId': { pt: 'ID do Caso', en: 'Case ID' },
  'agent.documents': { pt: 'Documentos', en: 'Documents' },
  'agent.changeStatus': { pt: 'Alterar Estado', en: 'Change Status' },
  'agent.verifyDoc': { pt: 'Verificar Documento', en: 'Verify Document' },
  'agent.rejectDoc': { pt: 'Rejeitar Documento', en: 'Reject Document' },
  'agent.rejectionNote': { pt: 'Nota de Rejeição (opcional)', en: 'Rejection Note (optional)' },
  'agent.addNote': { pt: 'Adicionar Nota', en: 'Add Note' },
  'agent.noCases': { pt: 'Nenhum caso atribuído no momento', en: 'No assigned cases at the moment' },
  'agent.caseDetails': { pt: 'Detalhes do Caso', en: 'Case Details' },
  'agent.backToAgentDash': { pt: '← Voltar ao Painel do Agente', en: '← Back to Agent Dashboard' },

  // Notifications
  'notification.title': { pt: 'Notificações', en: 'Notifications' },
  'notification.documentStatusChanged': { pt: 'Estado do documento alterado', en: 'Document status changed' },
  'notification.documentVerified': { pt: 'Documento verificado com sucesso', en: 'Document verified successfully' },
  'notification.documentRejected': { pt: 'Documento rejeitado', en: 'Document rejected' },
  'notification.markAsRead': { pt: 'Marcar como lido', en: 'Mark as read' },
  'notification.noNotifications': { pt: 'Nenhuma notificação', en: 'No notifications' },
  'notification.unreadCount': { pt: 'Notificações não lidas ({count})', en: 'Unread notifications ({count})' },

  // Documents Page
  'documents.backToDash': { pt: '← Voltar ao Dashboard', en: '← Back to Dashboard' },
  'documents.title': { pt: 'Meus Documentos', en: 'My Documents' },
  'documents.subtitle': { pt: 'Carregar e gerir seus documentos de propriedade', en: 'Upload and manage your property documents' },
  'documents.uploadNew': { pt: 'Carregar Novo Documento', en: 'Upload New Document' },
  'documents.docType': { pt: 'Tipo de Documento', en: 'Document Type' },
  'documents.selectType': { pt: 'Selecione o tipo', en: 'Select type' },
  'documents.titleDeed': { pt: 'Escritura de Propriedade', en: 'Title Deed' },
  'documents.propertyTax': { pt: 'Imposto de Propriedade', en: 'Property Tax' },
  'documents.mortgageDeed': { pt: 'Escritura de Hipoteca', en: 'Mortgage Deed' },
  'documents.valuationReport': { pt: 'Relatório de Avaliação', en: 'Valuation Report' },
  'documents.propertySurvey': { pt: 'Levantamento de Propriedade', en: 'Property Survey' },
  'documents.file': { pt: 'Ficheiro', en: 'File' },
  'documents.uploading': { pt: 'Carregando...', en: 'Uploading...' },
  'documents.uploadDoc': { pt: 'Carregar Documento', en: 'Upload Document' },
  'documents.myDocs': { pt: 'Meus Documentos', en: 'My Documents' },
  'documents.loading': { pt: 'Carregando...', en: 'Loading...' },
  'documents.noDocs': { pt: 'Nenhum documento carregado ainda', en: 'No documents uploaded yet' },
  'documents.uploaded': { pt: 'Carregado:', en: 'Uploaded:' },
  'documents.other': { pt: 'Outro', en: 'Other' },

  // CMA Page
  'cma.backToDash': { pt: '← Voltar ao Dashboard', en: '← Back to Dashboard' },
  'cma.title': { pt: 'Relatório CMA (Análise de Mercado Comparativa)', en: 'CMA (Comparative Market Analysis) Report' },
  'cma.subtitle': { pt: 'Gere uma análise de mercado detalhada para sua propriedade', en: 'Generate a detailed market analysis for your property' },
  'cma.propertyDetails': { pt: 'Detalhes da Propriedade', en: 'Property Details' },
  'cma.propertyType': { pt: 'Tipo de Propriedade', en: 'Property Type' },
  'cma.selectType': { pt: 'Selecione o tipo', en: 'Select type' },
  'cma.apartment': { pt: 'Apartamento', en: 'Apartment' },
  'cma.house': { pt: 'Casa', en: 'House' },
  'cma.townhouse': { pt: 'Moradia em Banda', en: 'Townhouse' },
  'cma.commercial': { pt: 'Comercial', en: 'Commercial' },
  'cma.bedrooms': { pt: 'Número de Quartos', en: 'Number of Bedrooms' },
  'cma.location': { pt: 'Localização', en: 'Location' },
  'cma.size': { pt: 'Tamanho (m²)', en: 'Size (m²)' },
  'cma.generate': { pt: 'Gerar Relatório', en: 'Generate Report' },
  'cma.generating': { pt: 'Gerando...', en: 'Generating...' },
  'cma.report': { pt: 'Relatório CMA', en: 'CMA Report' },
  'cma.estimatedValue': { pt: 'Valor Estimado', en: 'Estimated Value' },
  'cma.marketTrend': { pt: 'Tendência do Mercado', en: 'Market Trend' },
  'cma.comparableProperties': { pt: 'Propriedades Comparáveis', en: 'Comparable Properties' },
  'cma.address': { pt: 'Endereço', en: 'Address' },
  'cma.price': { pt: 'Preço', en: 'Price' },
  'cma.sqft': { pt: 'Área', en: 'Area' },
  'cma.recommendations': { pt: 'Recomendações', en: 'Recommendations' },
  'cma.marketInsights': { pt: 'Perspectivas de Mercado', en: 'Market Insights' },
  'cma.marketRange': { pt: 'Intervalo de Mercado', en: 'Market Range' },
  'cma.pricePerSqm': { pt: 'Preço por m²', en: 'Price per m²' },
  'cma.comparables': { pt: 'Propriedades Comparáveis', en: 'Comparable Properties' },
  'cma.fillDetails': { pt: 'Preencha os detalhes da propriedade e clique em "Gerar Relatório" para ver a análise de mercado', en: 'Fill in the property details and click "Generate Report" to view market analysis' },

  // Orders Page
  'orders.backToDash': { pt: '← Voltar ao Dashboard', en: '← Back to Dashboard' },
  'orders.title': { pt: 'Meus Pedidos', en: 'My Orders' },
  'orders.subtitle': { pt: 'Gerir e rastrear todos os seus pedidos', en: 'Manage and track all your orders' },
  'orders.filters': { pt: 'Filtros', en: 'Filters' },
  'orders.all': { pt: 'Todos', en: 'All' },
  'orders.active': { pt: 'Ativos', en: 'Active' },
  'orders.completed': { pt: 'Completos', en: 'Completed' },
  'orders.orderId': { pt: 'ID do Pedido', en: 'Order ID' },
  'orders.tier': { pt: 'Plano', en: 'Tier' },
  'orders.date': { pt: 'Data', en: 'Date' },
  'orders.status': { pt: 'Status', en: 'Status' },
  'orders.cost': { pt: 'Custo', en: 'Cost' },
  'orders.action': { pt: 'Ação', en: 'Action' },
  'orders.viewDetails': { pt: 'Ver Detalhes', en: 'View Details' },
  'orders.noOrders': { pt: 'Sem pedidos', en: 'No orders' },
  'orders.loading': { pt: 'Carregando pedidos...', en: 'Loading orders...' },

  // Settings Page  
  'settings.backToDash': { pt: '← Voltar ao Dashboard', en: '← Back to Dashboard' },
  'settings.title': { pt: 'Definições', en: 'Settings' },
  'settings.subtitle': { pt: 'Gerir suas preferências e configurações', en: 'Manage your preferences and settings' },
  'settings.account': { pt: 'Conta', en: 'Account' },
  'settings.notifications': { pt: 'Notificações', en: 'Notifications' },
  'settings.privacy': { pt: 'Privacidade', en: 'Privacy' },
  'settings.security': { pt: 'Segurança', en: 'Security' },
  'settings.changePassword': { pt: 'Alterar Senha', en: 'Change Password' },
  'settings.twoFactor': { pt: 'Autenticação de Dois Fatores', en: 'Two-Factor Authentication' },
  'settings.save': { pt: 'Guardar', en: 'Save' },
  'settings.saved': { pt: 'Guardado', en: 'Saved' },

  // Pricing Plans
  'pricing.standard_ideal': { pt: 'Apartamento ou moradia em condomínio, residente em Portugal', en: 'Apartment or townhouse, resident in Portugal' },
  'pricing.premium_ideal': { pt: 'Não-residente, herdeiros, situações complexas', en: 'Non-resident, heirs, complex situations' },
  'pricing.docexpress_ideal': { pt: 'Prazo urgente, divórcio, deadline confirmada', en: 'Urgent timeline, divorce, confirmed deadline' },
  
  // Pricing Features
  'pricing.f1': { pt: 'Caderneta Predial Urbana', en: 'Property Registry' },
  'pricing.f2': { pt: 'Certidão Permanente do Registo', en: 'Permanent Registration Certificate' },
  'pricing.f3': { pt: 'Licença de Utilização', en: 'Usage License' },
  'pricing.f4': { pt: 'Coordenação do Certificado Energético', en: 'Energy Certificate Coordination' },
  'pricing.f5': { pt: 'Declaração do Condomínio', en: 'Condominium Declaration' },
  'pricing.f6': { pt: 'Distrate de Hipoteca (se aplicável)', en: 'Mortgage Discharge (if applicable)' },
  
  'pricing.p1': { pt: 'Tudo do plano Standard', en: 'Everything from Standard' },
  'pricing.p2': { pt: 'Revisão Jurídica CPCV', en: 'Legal Review CPCV' },
  'pricing.p3': { pt: 'Cálculo de Mais-Valias', en: 'Capital Gains Calculation' },
  'pricing.p4': { pt: 'Coordenação com Solicitador', en: 'Solicitor Coordination' },
  'pricing.p5': { pt: 'Suporte dedicado', en: 'Dedicated Support' },
  'pricing.p6': { pt: 'Procurações (se necessário)', en: 'Powers of Attorney (if needed)' },
  
  'pricing.d1': { pt: 'Tudo do plano Premium', en: 'Everything from Premium' },
  'pricing.d2': { pt: 'Início em 48 horas', en: '48-hour Start' },
  'pricing.d3': { pt: 'Processamento em paralelo', en: 'Parallel Processing' },
  'pricing.d4': { pt: 'Suporte prioritário 24/7', en: '24/7 Priority Support' },
  'pricing.d5': { pt: 'Gestão de urgências', en: 'Emergency Management' },
  'pricing.d6': { pt: 'Garantia de conclusão', en: 'Completion Guarantee' },
  
  'pricing.timeline_standard': { pt: '15–20 dias úteis', en: '15–20 business days' },
  'pricing.timeline_premium': { pt: '20–30 dias úteis', en: '20–30 business days' },
  'pricing.timeline_docexpress': { pt: 'Início em 48h, 10 dias úteis', en: '48h start, 10 business days' },
  'pricing.contact': { pt: 'Falar connosco', en: 'Contact Us' },

  // Testimonials
  'testimonial.maria': { pt: 'Maria Silva', en: 'Maria Silva' },
  'testimonial.maria_city': { pt: 'Lisboa', en: 'Lisbon' },
  'testimonial.maria_quote': { pt: 'Consegui vender em 3 semanas. Sem Fizbo, estava perdida com os documentos.', en: 'I managed to sell in 3 weeks. Without Fizbo, I was lost with the documents.' },
  
  'testimonial.joao': { pt: 'João Santos', en: 'João Santos' },
  'testimonial.joao_city': { pt: 'Porto', en: 'Porto' },
  'testimonial.joao_quote': { pt: 'Excelente serviço. Coordenaram tudo com a câmara e o perito. Muito profissional.', en: 'Excellent service. They coordinated everything with the municipality and the expert. Very professional.' },
  
  'testimonial.ana': { pt: 'Ana Costa', en: 'Ana Costa' },
  'testimonial.ana_city': { pt: 'Algarve', en: 'Algarve' },
  'testimonial.ana_quote': { pt: 'Não sou residente. O Fizbo tratou de tudo por mim. Recomendo!', en: 'I\'m not a resident. Fizbo handled everything for me. I recommend it!' },

  // Operator Page
  'operator.backToDash': { pt: '← Voltar ao Dashboard', en: '← Back to Dashboard' },
  'operator.title': { pt: 'Fila de Operadores', en: 'Operator Queue' },
  'operator.subtitle': { pt: 'Gerir a fila de processamento de pedidos', en: 'Manage order processing queue' },
  'operator.status': { pt: 'Estado', en: 'Status' },
  'operator.queue': { pt: 'Fila', en: 'Queue' },
  'operator.position': { pt: 'Posição', en: 'Position' },
  'operator.timeRemaining': { pt: 'Tempo Restante', en: 'Time Remaining' },
  'operator.empty': { pt: 'Sem itens na fila', en: 'Queue is empty' },

  // Footer
  'footer.title': { pt: 'Fizbo', en: 'Fizbo' },
  'footer.description': { pt: 'Preparação de documentos para venda imobiliária em Portugal.', en: 'Document preparation for real estate sales in Portugal.' },
  'footer.links': { pt: 'Links', en: 'Links' },
  'footer.privacy': { pt: 'Política de Privacidade', en: 'Privacy Policy' },
  'footer.terms': { pt: 'Termos de Serviço', en: 'Terms of Service' },
  'footer.contact': { pt: 'Contactos', en: 'Contact' },

  // CTA Check Documents
  'home.checkDocuments': { pt: 'Verificar os meus documentos', en: 'Check My Documents' },

  // Order Creation Page
  'orders.create.title': { pt: 'Escolha o seu plano', en: 'Choose Your Plan' },
  'orders.create.subtitle': { pt: 'Selecionamos o plano {{plan}} com base na sua avaliação', en: 'We\'ve selected the {{plan}} plan based on your assessment' },
  'orders.create.recommended': { pt: 'RECOMENDADO', en: 'RECOMMENDED' },
  'orders.create.features': { pt: 'Funcionalidades', en: 'Features' },
  'orders.create.timeline': { pt: 'Cronograma', en: 'Timeline' },
  'orders.create.proceed': { pt: 'Proceder com o pagamento', en: 'Proceed with Payment' },
  'orders.create.contact': { pt: 'Falar connosco', en: 'Contact Us' },
  'orders.create.error': { pt: 'Erro ao criar encomenda. Por favor, tente novamente.', en: 'Error creating order. Please try again.' },
  'orders.create.creating': { pt: 'A criar encomenda...', en: 'Creating order...' },

  // Onboarding Page
  'onboarding.title': { pt: 'Bem-vindo ao Fizbo', en: 'Welcome to Fizbo' },
  'onboarding.subtitle': { pt: 'Última informação antes de começarmos', en: 'Last information before we start' },
  'onboarding.phone': { pt: 'Número de telemóvel', en: 'Phone Number' },
  'onboarding.whatsapp': { pt: 'Aceito receber notificações por WhatsApp', en: 'I accept WhatsApp notifications' },
  'onboarding.continue': { pt: 'Continuar', en: 'Continue' },
  'onboarding.processing': { pt: 'A processar...', en: 'Processing...' },
  'onboarding.confirmed': { pt: 'Encomenda confirmada!', en: 'Order Confirmed!' },
  'onboarding.working': { pt: 'Já estamos a trabalhar nos seus documentos.', en: 'We\'re already working on your documents.' },
  'onboarding.viewDashboard': { pt: 'Ver o meu painel', en: 'View My Dashboard' },
  'onboarding.error.phone': { pt: 'Por favor, introduza o seu número de telemóvel', en: 'Please enter your phone number' },
  'onboarding.error.generic': { pt: 'Erro desconhecido', en: 'Unknown error' },

  // Common
  'common.back': { pt: 'Voltar', en: 'Back' },
  'common.loading': { pt: 'Carregando', en: 'Loading' },
  'common.error': { pt: 'Erro', en: 'Error' },
  'common.save': { pt: 'Guardar', en: 'Save' },
  'common.cancel': { pt: 'Cancelar', en: 'Cancel' },
  'common.delete': { pt: 'Eliminar', en: 'Delete' },
  'common.close': { pt: 'Fechar', en: 'Close' },

  // Orders Detail Page
  'orders.detail.title': { pt: 'Encomenda', en: 'Order' },
  'orders.detail.sellerInfo': { pt: 'Informações do Vendedor', en: 'Seller Information' },
  'orders.detail.name': { pt: 'Nome', en: 'Name' },
  'orders.detail.email': { pt: 'Email', en: 'Email' },
  'orders.detail.phone': { pt: 'Telemóvel', en: 'Phone' },
  'orders.detail.whatsapp': { pt: 'WhatsApp', en: 'WhatsApp' },
  'orders.detail.orderInfo': { pt: 'Informações da Encomenda', en: 'Order Information' },
  'orders.detail.tier': { pt: 'Plano', en: 'Plan' },
  'orders.detail.created': { pt: 'Data de Criação', en: 'Created Date' },
  'orders.detail.completed': { pt: 'Data de Conclusão', en: 'Completed Date' },
  'orders.detail.operator': { pt: 'Operador Atribuído', en: 'Assigned Operator' },
  
  // Enhanced DocCheck Questions (NEW)
  'doccheck.enhanced.questions.email': { pt: 'Qual é o seu email?', en: 'What is your email?' },
  'doccheck.enhanced.questions.propertyType': { pt: 'Que tipo de propriedade deseja vender?', en: 'What type of property do you want to sell?' },
  'doccheck.enhanced.questions.condominium': { pt: 'A propriedade está em condomínio?', en: 'Is the property in a condominium?' },
  'doccheck.enhanced.questions.buildingAge': { pt: 'Qual é a idade da construção?', en: 'What is the building age?' },
  'doccheck.enhanced.questions.mortgage': { pt: 'A propriedade tem hipoteca?', en: 'Does the property have a mortgage?' },
  'doccheck.enhanced.questions.acquisition': { pt: 'Como adquiriu a propriedade?', en: 'How did you acquire the property?' },
  'doccheck.enhanced.questions.primaryResidence': { pt: 'É a sua residência principal?', en: 'Is it your primary residence?' },
  'doccheck.enhanced.questions.owners': { pt: 'Todos os proprietários estão disponíveis?', en: 'Are all owners available?' },
  'doccheck.enhanced.questions.energyCert': { pt: 'Tem certificado energético válido (< 10 anos)?', en: 'Do you have a valid energy certificate (< 10 years)?' },

  // NEW: Extended questions for 5 personas (Q9-Q12)
  'doccheck.enhanced.questions.sellerResidency': { pt: 'Qual é a sua situação de residência fiscal?', en: 'What is your fiscal residency status?' },
  'doccheck.enhanced.questions.numberOfHeirs': { pt: 'Quantos herdeiros existem (se aplicável)?', en: 'How many heirs are there (if applicable)?' },
  'doccheck.enhanced.questions.divorceCase': { pt: 'É um caso de divórcio ou separação?', en: 'Is this a divorce or separation case?' },
  'doccheck.enhanced.questions.urgency': { pt: 'Qual é o prazo para vender esta propriedade?', en: 'What is your timeline to sell this property?' },

  // DocCheck Enhanced Options (NEW)
  'doccheck.enhanced.options.yes': { pt: 'Sim', en: 'Yes' },
  'doccheck.enhanced.options.no': { pt: 'Não', en: 'No' },
  'doccheck.enhanced.options.yes_amicable': { pt: 'Sim, de forma amigável', en: 'Yes, amicable' },
  'doccheck.enhanced.options.yes_contested': { pt: 'Sim, contestada', en: 'Yes, contested' },
  'doccheck.enhanced.options.propertyType.apartment': { pt: 'Apartamento', en: 'Apartment' },
  'doccheck.enhanced.options.propertyType.house': { pt: 'Casa', en: 'House' },
  'doccheck.enhanced.options.propertyType.land': { pt: 'Terreno', en: 'Land' },
  'doccheck.enhanced.options.propertyType.other': { pt: 'Outro', en: 'Other' },
  'doccheck.enhanced.options.buildingAge.pre_1951': { pt: 'Antes de 1951', en: 'Before 1951' },
  'doccheck.enhanced.options.buildingAge.1951_1990': { pt: '1951-1990', en: '1951-1990' },
  'doccheck.enhanced.options.buildingAge.1991_2007': { pt: '1991-2007', en: '1991-2007' },
  'doccheck.enhanced.options.buildingAge.post_2007': { pt: 'Após 2007', en: 'After 2007' },
  'doccheck.enhanced.options.acquisition.purchase': { pt: 'Compra', en: 'Purchase' },
  'doccheck.enhanced.options.acquisition.inheritance': { pt: 'Herança', en: 'Inheritance' },
  'doccheck.enhanced.options.acquisition.divorce': { pt: 'Divórcio', en: 'Divorce' },
  'doccheck.enhanced.options.acquisition.gift': { pt: 'Doação', en: 'Gift' },
  'doccheck.enhanced.options.acquisition.other': { pt: 'Outro', en: 'Other' },
  'doccheck.enhanced.options.owners.yes': { pt: 'Sim, todos disponíveis', en: 'Yes, all available' },
  'doccheck.enhanced.options.owners.one_abroad': { pt: 'Um proprietário no estrangeiro', en: 'One owner abroad' },
  'doccheck.enhanced.options.owners.one_deceased': { pt: 'Um proprietário falecido', en: 'One owner deceased' },
  'doccheck.enhanced.options.owners.disputed': { pt: 'Propriedade em disputa', en: 'Disputed ownership' },

  // NEW: Residency options for P1-P5 persona mapping
  'doccheck.enhanced.options.residency.portugal_resident': { pt: 'Residente em Portugal (P1)', en: 'Portugal resident (P1)' },
  'doccheck.enhanced.options.residency.non_resident_eu': { pt: 'Não-residente UE (P2)', en: 'Non-resident EU (P2)' },
  'doccheck.enhanced.options.residency.non_resident_other': { pt: 'Não-residente fora UE', en: 'Non-resident outside EU' },

  // NEW: Heirs options for P3 persona
  'doccheck.enhanced.options.heirs.1': { pt: '1 herdeiro (vendedor único)', en: '1 heir (single seller)' },
  'doccheck.enhanced.options.heirs.2_3': { pt: '2-3 herdeiros', en: '2-3 heirs' },
  'doccheck.enhanced.options.heirs.4_or_more': { pt: '4 ou mais herdeiros', en: '4 or more heirs' },
  'doccheck.enhanced.options.heirs.disputed': { pt: 'Propriedade em disputa sucessória', en: 'Disputed succession' },

  // NEW: Urgency options for P4-P5 personas
  'doccheck.enhanced.options.urgency.flexible': { pt: 'Flexível (6+ meses)', en: 'Flexible (6+ months)' },
  'doccheck.enhanced.options.urgency.3_months': { pt: '3 meses', en: '3 months' },
  'doccheck.enhanced.options.urgency.1_month': { pt: '1 mês', en: '1 month' },
  'doccheck.enhanced.options.urgency.urgent': { pt: 'Urgente (semanas)', en: 'Urgent (weeks)' },

  // DocCheck Enhanced Hints (NEW)
  'doccheck.enhanced.emailHint': { pt: 'Este email será usado para atualizações sobre o seu processo', en: 'This email will be used for updates about your process' },
  'doccheck.enhanced.propertyTypeHint': { pt: 'Selecione o tipo de propriedade que deseja vender', en: 'Select the type of property you want to sell' },
  'doccheck.enhanced.condominiumHint': { pt: 'Propriedades em condomínio requerem documentação adicional', en: 'Properties in a condominium require additional documentation' },
  'doccheck.enhanced.buildingAgeHint': { pt: 'A idade do prédio afeta os documentos necessários', en: 'Building age affects the required documents' },
  'doccheck.enhanced.mortgageHint': { pt: 'Se há hipoteca, necessita distrate antes de vender', en: 'If there is a mortgage, discharge is needed before selling' },
  'doccheck.enhanced.acquisitionHint': { pt: 'Heranças e divórcios podem ter requisitos especiais', en: 'Inheritances and divorces may have special requirements' },
  'doccheck.enhanced.primaryResidenceHint': { pt: 'Residências principais têm tratamento diferente', en: 'Primary residences have different treatment' },
  'doccheck.enhanced.ownersHint': { pt: 'Se há proprietários no estrangeiro, precisamos de procuração', en: 'If there are owners abroad, we need power of attorney' },
  'doccheck.enhanced.sellerResidencyHint': { pt: 'A residência fiscal determina a documentação requerida e as obrigações fiscais', en: 'Tax residency determines required documentation and tax obligations' },
  'doccheck.enhanced.numberOfHeirsHint': { pt: 'Casos de herança complexos requerem coordenação legal adicional', en: 'Complex inheritance cases require additional legal coordination' },
  'doccheck.enhanced.divorceHint': { pt: 'Propriedades em divórcio requerem concordância de ambas as partes', en: 'Properties in divorce require both parties agreement' },
  'doccheck.enhanced.urgencyHint': { pt: 'Prazos urgentes podem requerer serviço DocExpress', en: 'Urgent timelines may require DocExpress service' },

  // DocCheck Enhanced Steps (NEW)
  'doccheck.enhanced.step': { pt: 'Passo', en: 'Step' },
  'doccheck.enhanced.submit': { pt: 'Ver Resultado', en: 'View Result' },
  'doccheck.enhanced.errors.missingFields': { pt: 'Por favor, preencha todos os campos obrigatórios', en: 'Please fill in all required fields' },
  'doccheck.enhanced.errors.assessmentFailed': { pt: 'Falha ao completar avaliação', en: 'Failed to complete assessment' },
  'doccheck.enhanced.errors.unknown': { pt: 'Erro desconhecido', en: 'Unknown error' },

  // DocCheck Enhanced Results (NEW)
  'doccheck.enhanced.results.recommendedTier': { pt: 'Plano Recomendado', en: 'Recommended Plan' },
  'doccheck.enhanced.results.tierSummary': { pt: 'Resumo do Plano', en: 'Plan Summary' },
  'doccheck.enhanced.results.price': { pt: 'Preço', en: 'Price' },
  'doccheck.enhanced.results.missingDocs': { pt: 'Documentos em Falta', en: 'Missing Documents' },
  'doccheck.enhanced.results.riskFlagsCount': { pt: 'Sinais de Alerta', en: 'Risk Flags' },
  'doccheck.enhanced.results.missingDocuments': { pt: 'Documentos que Precisa Obter', en: 'Documents You Need to Get' },
  'doccheck.enhanced.results.riskFlags': { pt: 'Sinais de Alerta', en: 'Risk Flags' },
  'doccheck.enhanced.results.viewSmartCMA': { pt: 'Ver Avaliação SmartCMA Gratuita', en: 'View Free SmartCMA Report' },
  'doccheck.enhanced.results.selectTier': { pt: 'Proceder com Este Plano', en: 'Proceed with This Plan' },

  // Common Actions (NEW)
  'common.next': { pt: 'Seguinte', en: 'Next' },
  'common.previous': { pt: 'Anterior', en: 'Previous' },
  'common.restart': { pt: 'Recomeçar', en: 'Restart' },

};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translationPair = translations[key];
    if (!translationPair) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translationPair[language];
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a safe default during SSR/hydration mismatch
    return {
      language: 'pt',
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}
