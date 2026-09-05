import { Request, Response } from 'express';
import { prisma } from '../../database/prisma.service.js';

export const getBudget = async (req: Request, res: Response) => {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos: userId, month, year' });
    }

    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: String(userId),
          month: Number(month),
          year: Number(year),
        },
      },
      include: {
        allocations: {
          include: { category: true },
        },
      },
    });

    const taxes = await prisma.taxDeduction.findMany({
      where: { userId: String(userId) },
    });

    res.status(200).json({ data: { budget, taxes } });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el presupuesto', error });
  }
};

export const saveBudget = async (req: Request, res: Response) => {
  try {
    const { userId, fixedSalary, invoicedIncome, month, year, taxes, allocations } = req.body;

    // Guardar o actualizar Presupuesto base
    const budget = await prisma.budget.upsert({
      where: {
        userId_month_year: { userId, month, year },
      },
      update: { fixedSalary, invoicedIncome },
      create: { userId, fixedSalary, invoicedIncome, month, year },
    });

    // Guardar/actualizar Deducciones personalizadas
    if (Array.isArray(taxes)) {
      for (const tax of taxes) {
        if (tax.id && !tax.id.startsWith('temp-')) {
          await prisma.taxDeduction.update({
            where: { id: tax.id },
            data: { name: tax.name, type: tax.type, value: tax.value, appliesTo: tax.appliesTo, active: tax.active },
          });
        } else {
          await prisma.taxDeduction.create({
            data: { userId, name: tax.name, type: tax.type, value: tax.value, appliesTo: tax.appliesTo, active: tax.active },
          });
        }
      }
    }

    res.status(200).json({ message: 'Presupuesto guardado exitosamente', data: budget });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el presupuesto', error });
  }
};