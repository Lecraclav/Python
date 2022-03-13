import Prisma from "@prisma/client";
import { prisma } from "../prisma.js";
import { ArchivosService } from "./archivos.service.js";

export class ProductoService {
  static async crearProducto(data) {
    try {
      const nuevoProducto = await prisma.producto.create({
        data,
      });

      return { content: nuevoProducto };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.Prisma.PrismaClientValidationError) {
        return {
          message: "error en la validacion de prisma",
        };
      }

      if (error instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
        // https://www.prisma.io/docs/reference/api-reference/error-reference

        // el producto ya existe
        // la data es insuficiente
        // la fk del tipo de producto no existe
        // si es que queremos eliminar y ese registro tiene relacion con otra tabla no permitira la eliminacion
        return {
          message: "Error al crear el producto",
          content: error.message,
        };
      }
    }
  }

  static async devolverProducto(id) {
    // buscar ese producto y si no existe retornar lo sgte:
    // {
    //   message:'No existe el producto con id 1'
    // }
    const producto = await prisma.producto.findUnique({
      where: { id: +id },
      // si usamos el include no podemos usar el select y viseversa
      include: { tipoProducto: true },
      rejectOnNotFound: false,
      // select: {nombre: true}
    });

    // if(!producto)
    if (producto === undefined) {
      return {
        message: `No existe el producto con el id ${id}`,
      };
    }

    const productoConImagen = {
      ...producto,
      imagen: ArchivosService.devolverURL(producto.imagen),
    };

    return {
      producto: productoConImagen,
    };
  }

  static async listarProductos() {
    const productos = await prisma.producto.findMany({
      include: { tipoProducto: true },
    });

    const productosIterados = productos.map((producto) => {
      return {
        ...producto,
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND
        // el operador Logical AND ( && ) servira para que si el primer parametro es nulo o undefined o falso no pasara al segundo contenido, caso contrario si lo hara
        // el operador Logical OR ( || ) es si el primero es falso, undefined o null pasara a validar el segundo, si ese tbn es de alguno de esos valores su contenido sera nulo, caso contrario tomara el primero o el segundo
        // nullish coalescing operator ( ?? ) si el primer valor no es nulo o undefined tomara el primer valor caso contrario tomara el segundo valor
        imagen: producto.imagen && ArchivosService.devolverURL(producto.imagen),
        // imagen: producto.imagen
        //   ? ArchivosService.devolverURL(producto.imagen)
        //   : null,
      };
    });
    return { productos: productosIterados };
  }

  static async eliminarProducto(id) {
    const productoEncontrado = await prisma.producto.findUnique({
      where: { id },
      rejectOnNotFound: true,
      select: { imagen: true },
    });

    if (productoEncontrado.imagen) {
      ArchivosService.eliminarArchivo(productoEncontrado.imagen);
    }

    const productoEliminado = await prisma.producto.delete({ where: { id } });

    return { producto: productoEliminado };
  }
}