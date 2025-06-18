export const totalUsers =  `
    SELECT COUNT(DISTINCT t200.f200_nit) AS TotalUsuarios FROM unoee.dbo.t200_mm_terceros AS t200
    INNER JOIN unoee.dbo.w0540_empleados
        ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
        AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
    LEFT JOIN unoee.dbo.t210_mm_vendedores 
        ON f210_rowid_tercero = t200.f200_rowid
    INNER JOIN unoee.dbo.w0550_contratos 
        ON w0550_contratos.c0550_rowid_tercero = t200.f200_rowid
    LEFT JOIN unoee.dbo.t284_co_ccosto cco   
        ON cco.f284_rowid = w0550_contratos.c0550_rowid_ccosto
    LEFT JOIN unoee.dbo.W0763_GH01_CARGOS CARGOS 
        ON w0550_contratos.C0550_ROWID_CARGO = CARGOS.C0763_ROWID
    LEFT JOIN unoee.dbo.w0510_grupos_empleados AS grupo_emp 
        ON grupo_emp.c0510_rowid = w0550_contratos.c0550_rowid_grupo_empleados
    LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil 
        ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
        AND indestcivil.c0006_valor = w0540_empleados.c0540_ind_estado_civil
    LEFT JOIN unoee.dbo.w0003_lenguajes 
        ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje
    LEFT JOIN unoee.dbo.w0555_motivos_retiro AS Retiros 
        ON Retiros.c0555_id = w0550_contratos.c0550_id_motivo_retiro

    WHERE w0003_lenguajes.c0003_id = 1 AND w0550_contratos.c0550_ind_estado = 1`

export const users = (page = 1, limit = 30) => {
    return `
        DECLARE @Pagina INT = ${page};
        DECLARE @TamanoPagina INT = ${limit}
        
        SELECT distinct   
        case when c0540_id_cia=1 then 'New Stetic'  else 'Temporal' end Empresa 
        , convert(varchar(1),[w0550_contratos].c0550_id) as id_Contrato
        ,t200.f200_nit
        ,f200_id_tipo_ident as "Tipo de indetificacion"
        ,t200.f200_apellido1,t200.f200_apellido2,t200.f200_nombres
        ,c0540_id_cia as id_compañia
        ,convert(nvarchar,[w0550_contratos].c0550_fecha_ingreso,112) as [Fecha de ingreso]
        ,convert(nvarchar,c0540_fecha_nacimiento,112) as [Fecha de nacimiento]
        ,w0540_empleados.c0540_id_pais_nacimiento
        ,w0540_empleados.c0540_id_depto_nacimiento
        ,w0540_empleados.c0540_id_ciudad_nacimiento
        ,convert(nvarchar,w0540_empleados.c0540_fecha_exp_identif,112) as "fecha de expedicion"
        ,w0540_empleados.c0540_id_pais_exp_identif
        ,w0540_empleados.c0540_id_depto_exp_identif
        ,w0540_empleados.c0540_id_ciudad_exp_identif
        ,w0540_empleados.c0540_ind_sexo
        ,w0540_empleados.c0540_ind_extranjero
        ,f200_ind_empleado
        ,c0540_ind_declarante
                    ,CARGOS.C0763_ID as Cargo,CARGOS.C0763_DESCRIPCION as "Desc. Cargo"
                    ,CARGOS.[c0763_rowid_jefe_inmediato] As CodigoJefeImediato
        
                    ,cco.f284_id as Id_cco
                    ,cco.f284_descripcion as [Centro de costos]
                    , f200_nombres +' ' + f200_apellido1+' ' + f200_apellido2 as Nombre
                    ,[f015_email] as [Correo Electronico]
                    ,convert(varchar(6),[w0550_contratos].c0550_fecha_ingreso,112) as PeriodoIngreso
                    ,[w0550_contratos].[c0550_fecha_retiro] as [Fecha de Retiro]
                    ,[w0550_contratos].c0550_ind_estado as [Estado Empleado]
                    ,[f107_descripcion] as Gerencia
                    ,grupo_emp.c0510_id as  [Id_Grupo empleado]
                    ,CASE when [c0510_descripcion] in ('EXPORTACIONES', 'VENTAS NACIONALES') then 'VENTAS' ELSE [c0510_descripcion] END  [Grupo empleado]
                    ,ISNULL(indestcivil.c0006_descripcion, '') as [Estado civil]
                    ,case 
                    when ISNULL(indestcivil.c0006_descripcion, '')='Casado' then 2
                    when ISNULL(indestcivil.c0006_descripcion, '')='Divorciado' then 4
                    when ISNULL(indestcivil.c0006_descripcion, '')='Soltero' then 1
                    when ISNULL(indestcivil.c0006_descripcion, '')='Union libre' then 5
                    when ISNULL(indestcivil.c0006_descripcion, '')='Viudo' then 3
                    else 0
                    end as ind_estado_cilvil
                    , T18.c0006_descripcion as [Tipo de contrato]
                    ,c0540_fecha_nacimiento as [Fecha de nacimiento]
                    ,[c0702_descripcion] as [Nivel educativo]
                    ,f013_descripcion as Ciudad
                    ,[f012_descripcion] as Departamento
                    ,[f011_descripcion] as Pais
                    ,Proceso.Proceso
                    ,TipoAprendiz
                    ,Retiros.c0555_descripcion
                    ,Retiros.notas_retiro
                    ,Retiros.idmotivo
                    ,Retiros.fechaRetiro
                    ,case when w0540_empleados.c0540_ind_sexo='0' then 'Hombre' else 'Mujer' end Genero
                    ,case when w0540_empleados.c0540_ind_sexo='0' then 'M' else 'F' end Genero2
                    ,[f210_ind_vendedor]
                    --,*
        FROM            
        unoee.dbo.t200_mm_terceros AS t200 inner join  unoee.dbo.w0540_empleados
        on w0540_empleados.c0540_id_cia=t200.f200_id_cia 
        and t200.f200_rowid=w0540_empleados.c0540_rowid_tercero
        left join unoee.dbo.t210_mm_vendedores on [f210_rowid_tercero]=t200.f200_rowid
        inner join unoee.dbo.[w0550_contratos] 
            on  [w0550_contratos].[c0550_rowid_tercero]=t200.f200_rowid
        LEFT JOIN  unoee.dbo.t284_co_ccosto cco  	ON	cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        LEFT JOIN  unoee.dbo.W0763_GH01_CARGOS CARGOS ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        LEFT JOIN  unoee.dbo.[w0763_gh01_cargos] as Jefes ON 
        cargos.c0763_rowid_jefe_inmediato=Jefes.c0763_rowid_jefe_inmediato
        LEFT JOIN unoee.dbo.t015_mm_contactos ON t015_mm_contactos.[f015_rowid]=t200.[f200_rowid_contacto]
        LEFT OUTER JOIN
        Unoee.dbo.t011_mm_paises AS C011 ON f015_id_pais = C011.f011_id LEFT OUTER JOIN
        Unoee.dbo.t012_mm_deptos AS C012 ON f015_id_depto = C012.f012_id AND C012.f012_id_pais = C011.f011_id LEFT OUTER JOIN
        Unoee.dbo.t013_mm_ciudades AS T013 ON f015_id_ciudad = T013.f013_id AND T013.f013_id_depto = C012.f012_id 
        AND T013.f013_id_pais = C011.f011_id
        LEFT JOIN unoee.dbo.[t107_mc_proyectos] ON f107_id=[w0550_contratos].c0550_id_proyecto 
                and [f107_id_cia]=[w0550_contratos].c0550_id_cia
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp ON grupo_emp.[c0510_rowid]=[w0550_contratos].c0550_rowid_grupo_empleados
        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
        AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        LEFT JOIN
        unoee.dbo.w0003_lenguajes ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
        --AND dbo.w0003_lenguajes.c0003_id = indgrusang.c0006_id_lenguaje AND 
        --dbo.w0003_lenguajes.c0003_id = indest.c0006_id_lenguaje 
        --AND dbo.w0003_lenguajes.c0003_id = indsexo.c0006_id_lenguaje 
        --AND dbo.w0003_lenguajes.c0003_id = indcatcar.c0006_id_lenguaje AND 
        --dbo.w0003_lenguajes.c0003_id = indcatmot.c0006_id_lenguaje 
        LEFT OUTER JOIN
        unoee.dbo.w0006_tipos AS T18 ON T18.c0006_id_tipo = 'c0550_ind_termino' 
        AND T18.c0006_id_lenguaje = 1 AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        LEFT OUTER JOIN
        [Unoee].[dbo].[w0702_gh01_nivel_academico] as Nivel_academico on [c0702_rowid]=w0540_empleados.[c0540_id_nivel_educativo]
        Left outer join
        (select v743.v743_rowid,v743_texto as Proceso from [Unoee].[dbo].[t743_mm_entidad_atributo] as Atributo
                    inner  join unoee.dbo.[v743] as v743 on Atributo.[f743_rowid]=v743_rowid_entidad_atributo
                    --left outer join [Unoee].[dbo].[t741_mm_maestro_detalle] as Detalle_Maestro on  Detalle_Maestro.f741_rowid_maestro=f743_rowid_maestro
        where atributo.f743_rowid_entidad='108' and f743_ind_tipo_atributo='7' and f743_rowid_maestro=143 and  v743_rowid_entidad_atributo=1478) as Proceso
        on Proceso.v743_rowid=[w0550_contratos].c0550_rowid_movto_entidad
        Left outer join 
        (select v743.v743_rowid,v743_texto as TipoAprendiz 
                    from [Unoee].[dbo].[t743_mm_entidad_atributo] as Atributo
                    Inner  join unoee.dbo.[v743] as v743 on Atributo.[f743_rowid]=v743_rowid_entidad_atributo
                    --inner join [Unoee].[dbo].[t741_mm_maestro_detalle] as Detalle_Maestro 
                    --on  Detalle_Maestro.f741_rowid_maestro=f743_rowid_maestro
        where atributo.f743_rowid_entidad='108' and f743_ind_tipo_atributo='7'  
        and f743_rowid_maestro=145 and v743_rowid_entidad_atributo=1632 ) As TipoAprendiz
        on TipoAprendiz.v743_rowid=[w0550_contratos].c0550_rowid_movto_entidad
        --------------------------------------------------------------------------------------------------
        LEFT join (SELECT distinct
            terc.f200_id as Cedula
            ,convert(varchar(1),contra.c0550_id) as id_Contrato 
            ,[c0555_id] as idmotivo
            ,contra.[c0550_fecha_retiro] as fechaRetiro
            ,[c0555_descripcion]
            ,[c0555_notas] as notas_retiro
            ,[c0555_ind_lista_negra]
            ,[c0555_ind_indemnizacion]
            ,mvto.c0602_id_cia
        from 
        unoee.dbo.w0602_movto_nomina as mvto  
        INNER JOIN unoee.dbo.t200_mm_terceros terc ON terc.f200_rowid = mvto.c0602_rowid_tercero  
        INNER JOIN unoee.dbo.w0600_docto_nomina docto ON mvto.c0602_rowid_docto_nm = docto.c0600_rowid   
        INNER JOIN unoee.dbo.w0501_conceptos cpto      ON cpto.c0501_rowid = mvto.c0602_rowid_concepto  
        INNER JOIN unoee.dbo.w0550_contratos contra      ON contra.c0550_rowid = mvto.c0602_rowid_contrato     
        LEFT JOIN  unoee.dbo.t285_co_centro_op co  	ON	co.f285_id_cia = mvto.c0602_id_cia AND co.f285_id = mvto.c0602_id_co_mov
        LEFT JOIN  unoee.dbo.t284_co_ccosto cco  	ON	cco.f284_rowid = mvto.c0602_rowid_ccosto_mov
        and cco.f284_id_cia=mvto.c0602_id_cia
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp ON grupo_emp.[c0510_rowid]=contra.c0550_rowid_grupo_empleados
        left join unoee.dbo.[w0555_motivos_retiro] on [c0550_id_motivo_retiro]=[c0555_id]
        
        where
        ( docto.c0600_id_periodo >= '202207') 
        AND ( mvto.c0602_id_cia in ('1','8','9') ) 
        --and contra.[c0550_fecha_retiro] > 0
        ) as Retiros
        on retiros.Cedula=t200.f200_nit and retiros.c0602_id_cia=c0540_id_cia
        
        -------------------------------------------------------

        where  (w0003_lenguajes.c0003_id in (1))  
        --id_Contrato=1  
        and [w0550_contratos].c0550_ind_estado=1
        and Retiros.fechaRetiro is null
        
        order by f200_nombres +' ' + f200_apellido1+' ' + f200_apellido2
        OFFSET (@Pagina - 1) * @TamanoPagina ROWS FETCH NEXT @TamanoPagina ROWS ONLY
    `
}

export const userByProperties = `SELECT distinct   
        case when c0540_id_cia=1 then 'New Stetic'  else 'Temporal' end Empresa 
        , convert(varchar(1),[w0550_contratos].c0550_id) as id_Contrato
        ,t200.f200_nit
        ,f200_id_tipo_ident as "Tipo de indetificacion"
        ,t200.f200_apellido1,t200.f200_apellido2,t200.f200_nombres
        ,c0540_id_cia as id_compañia
        ,convert(nvarchar,[w0550_contratos].c0550_fecha_ingreso,112) as [Fecha de ingreso]
        ,convert(nvarchar,c0540_fecha_nacimiento,112) as [Fecha de nacimiento]
        ,w0540_empleados.c0540_id_pais_nacimiento
        ,w0540_empleados.c0540_id_depto_nacimiento
        ,w0540_empleados.c0540_id_ciudad_nacimiento
        ,convert(nvarchar,w0540_empleados.c0540_fecha_exp_identif,112) as "fecha de expedicion"
        ,w0540_empleados.c0540_id_pais_exp_identif
        ,w0540_empleados.c0540_id_depto_exp_identif
        ,w0540_empleados.c0540_id_ciudad_exp_identif
        ,w0540_empleados.c0540_ind_sexo
        ,w0540_empleados.c0540_ind_extranjero
        ,f200_ind_empleado
        ,c0540_ind_declarante
                    ,CARGOS.C0763_ID as Cargo,CARGOS.C0763_DESCRIPCION as "Desc. Cargo"
                    ,CARGOS.[c0763_rowid_jefe_inmediato] As CodigoJefeImediato
        
                    ,cco.f284_id as Id_cco
                    ,cco.f284_descripcion as [Centro de costos]
                    , f200_nombres +' ' + f200_apellido1+' ' + f200_apellido2 as Nombre
                    ,[f015_email] as [Correo Electronico]
                    ,convert(varchar(6),[w0550_contratos].c0550_fecha_ingreso,112) as PeriodoIngreso
                    ,[w0550_contratos].[c0550_fecha_retiro] as [Fecha de Retiro]
                    ,[w0550_contratos].c0550_ind_estado as [Estado Empleado]
                    ,[f107_descripcion] as Gerencia
                    ,grupo_emp.c0510_id as  [Id_Grupo empleado]
                    ,CASE when [c0510_descripcion] in ('EXPORTACIONES', 'VENTAS NACIONALES') then 'VENTAS' ELSE [c0510_descripcion] END  [Grupo empleado]
                    ,ISNULL(indestcivil.c0006_descripcion, '') as [Estado civil]
                    ,case 
                    when ISNULL(indestcivil.c0006_descripcion, '')='Casado' then 2
                    when ISNULL(indestcivil.c0006_descripcion, '')='Divorciado' then 4
                    when ISNULL(indestcivil.c0006_descripcion, '')='Soltero' then 1
                    when ISNULL(indestcivil.c0006_descripcion, '')='Union libre' then 5
                    when ISNULL(indestcivil.c0006_descripcion, '')='Viudo' then 3
                    else 0
                    end as ind_estado_cilvil
                    , T18.c0006_descripcion as [Tipo de contrato]
                    ,c0540_fecha_nacimiento as [Fecha de nacimiento]
                    ,[c0702_descripcion] as [Nivel educativo]
                    ,f013_descripcion as Ciudad
                    ,[f012_descripcion] as Departamento
                    ,[f011_descripcion] as Pais
                    ,Proceso.Proceso
                    ,TipoAprendiz
                    ,Retiros.c0555_descripcion
                    ,Retiros.notas_retiro
                    ,Retiros.idmotivo
                    ,Retiros.fechaRetiro
                    ,case when w0540_empleados.c0540_ind_sexo='0' then 'Hombre' else 'Mujer' end Genero
                    ,case when w0540_empleados.c0540_ind_sexo='0' then 'M' else 'F' end Genero2
                    ,[f210_ind_vendedor]
                    --,*
        FROM            
        unoee.dbo.t200_mm_terceros AS t200 inner join  unoee.dbo.w0540_empleados
        on w0540_empleados.c0540_id_cia=t200.f200_id_cia 
        and t200.f200_rowid=w0540_empleados.c0540_rowid_tercero
        left join unoee.dbo.t210_mm_vendedores on [f210_rowid_tercero]=t200.f200_rowid
        inner join unoee.dbo.[w0550_contratos] 
            on  [w0550_contratos].[c0550_rowid_tercero]=t200.f200_rowid
        LEFT JOIN  unoee.dbo.t284_co_ccosto cco  	ON	cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        LEFT JOIN  unoee.dbo.W0763_GH01_CARGOS CARGOS ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        LEFT JOIN  unoee.dbo.[w0763_gh01_cargos] as Jefes ON 
        cargos.c0763_rowid_jefe_inmediato=Jefes.c0763_rowid_jefe_inmediato
        LEFT JOIN unoee.dbo.t015_mm_contactos ON t015_mm_contactos.[f015_rowid]=t200.[f200_rowid_contacto]
        LEFT OUTER JOIN
        Unoee.dbo.t011_mm_paises AS C011 ON f015_id_pais = C011.f011_id LEFT OUTER JOIN
        Unoee.dbo.t012_mm_deptos AS C012 ON f015_id_depto = C012.f012_id AND C012.f012_id_pais = C011.f011_id LEFT OUTER JOIN
        Unoee.dbo.t013_mm_ciudades AS T013 ON f015_id_ciudad = T013.f013_id AND T013.f013_id_depto = C012.f012_id 
        AND T013.f013_id_pais = C011.f011_id
        LEFT JOIN unoee.dbo.[t107_mc_proyectos] ON f107_id=[w0550_contratos].c0550_id_proyecto 
                and [f107_id_cia]=[w0550_contratos].c0550_id_cia
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp ON grupo_emp.[c0510_rowid]=[w0550_contratos].c0550_rowid_grupo_empleados
        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
        AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        LEFT JOIN
        unoee.dbo.w0003_lenguajes ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
        --AND dbo.w0003_lenguajes.c0003_id = indgrusang.c0006_id_lenguaje AND 
        --dbo.w0003_lenguajes.c0003_id = indest.c0006_id_lenguaje 
        --AND dbo.w0003_lenguajes.c0003_id = indsexo.c0006_id_lenguaje 
        --AND dbo.w0003_lenguajes.c0003_id = indcatcar.c0006_id_lenguaje AND 
        --dbo.w0003_lenguajes.c0003_id = indcatmot.c0006_id_lenguaje 
        LEFT OUTER JOIN
        unoee.dbo.w0006_tipos AS T18 ON T18.c0006_id_tipo = 'c0550_ind_termino' 
        AND T18.c0006_id_lenguaje = 1 AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        LEFT OUTER JOIN
        [Unoee].[dbo].[w0702_gh01_nivel_academico] as Nivel_academico on [c0702_rowid]=w0540_empleados.[c0540_id_nivel_educativo]
        Left outer join
        (select v743.v743_rowid,v743_texto as Proceso from [Unoee].[dbo].[t743_mm_entidad_atributo] as Atributo
                    inner  join unoee.dbo.[v743] as v743 on Atributo.[f743_rowid]=v743_rowid_entidad_atributo
                    --left outer join [Unoee].[dbo].[t741_mm_maestro_detalle] as Detalle_Maestro on  Detalle_Maestro.f741_rowid_maestro=f743_rowid_maestro
        where atributo.f743_rowid_entidad='108' and f743_ind_tipo_atributo='7' and f743_rowid_maestro=143 and  v743_rowid_entidad_atributo=1478) as Proceso
        on Proceso.v743_rowid=[w0550_contratos].c0550_rowid_movto_entidad
        Left outer join 
        (select v743.v743_rowid,v743_texto as TipoAprendiz 
                    from [Unoee].[dbo].[t743_mm_entidad_atributo] as Atributo
                    Inner  join unoee.dbo.[v743] as v743 on Atributo.[f743_rowid]=v743_rowid_entidad_atributo
                    --inner join [Unoee].[dbo].[t741_mm_maestro_detalle] as Detalle_Maestro 
                    --on  Detalle_Maestro.f741_rowid_maestro=f743_rowid_maestro
        where atributo.f743_rowid_entidad='108' and f743_ind_tipo_atributo='7'  
        and f743_rowid_maestro=145 and v743_rowid_entidad_atributo=1632 ) As TipoAprendiz
        on TipoAprendiz.v743_rowid=[w0550_contratos].c0550_rowid_movto_entidad
        --------------------------------------------------------------------------------------------------
        LEFT join (SELECT distinct
            terc.f200_id as Cedula
            ,convert(varchar(1),contra.c0550_id) as id_Contrato 
            ,[c0555_id] as idmotivo
            ,contra.[c0550_fecha_retiro] as fechaRetiro
            ,[c0555_descripcion]
            ,[c0555_notas] as notas_retiro
            ,[c0555_ind_lista_negra]
            ,[c0555_ind_indemnizacion]
            ,mvto.c0602_id_cia
        from 
        unoee.dbo.w0602_movto_nomina as mvto  
        INNER JOIN unoee.dbo.t200_mm_terceros terc ON terc.f200_rowid = mvto.c0602_rowid_tercero  
        INNER JOIN unoee.dbo.w0600_docto_nomina docto ON mvto.c0602_rowid_docto_nm = docto.c0600_rowid   
        INNER JOIN unoee.dbo.w0501_conceptos cpto      ON cpto.c0501_rowid = mvto.c0602_rowid_concepto  
        INNER JOIN unoee.dbo.w0550_contratos contra      ON contra.c0550_rowid = mvto.c0602_rowid_contrato     
        LEFT JOIN  unoee.dbo.t285_co_centro_op co  	ON	co.f285_id_cia = mvto.c0602_id_cia AND co.f285_id = mvto.c0602_id_co_mov
        LEFT JOIN  unoee.dbo.t284_co_ccosto cco  	ON	cco.f284_rowid = mvto.c0602_rowid_ccosto_mov
        and cco.f284_id_cia=mvto.c0602_id_cia
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp ON grupo_emp.[c0510_rowid]=contra.c0550_rowid_grupo_empleados
        left join unoee.dbo.[w0555_motivos_retiro] on [c0550_id_motivo_retiro]=[c0555_id]
        
        where
        ( docto.c0600_id_periodo >= '202207') 
        AND ( mvto.c0602_id_cia in ('1','8','9') ) 
        --and contra.[c0550_fecha_retiro] > 0
        ) as Retiros
        on retiros.Cedula=t200.f200_nit and retiros.c0602_id_cia=c0540_id_cia
        
        -------------------------------------------------------

        WHERE
			w0003_lenguajes.c0003_id IN (1)
			AND [w0550_contratos].c0550_ind_estado = 1
			AND Retiros.fechaRetiro IS NULL
			AND (
				t200.f200_nit LIKE @property OR
				f200_nombres LIKE @property OR
				f200_apellido1 LIKE @property OR
				f200_apellido2 LIKE @property OR
				f015_email LIKE @property OR
				CARGOS.C0763_DESCRIPCION LIKE @property
			)
`