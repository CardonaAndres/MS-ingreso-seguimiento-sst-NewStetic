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

    WHERE w0003_lenguajes.c0003_id = 1 
    AND [w0550_contratos].c0550_ind_estado = 1
`

export const totalUsersIdles = `
    SELECT COUNT(DISTINCT t200.f200_nit) AS TotalUsuariosInactivos
    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid
        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil 
            ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
            AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        LEFT JOIN unoee.dbo.w0003_lenguajes 
            ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
    WHERE (w0003_lenguajes.c0003_id IN (1))
        AND [w0550_contratos].c0550_ind_estado != 1
        AND t200.f200_nit NOT IN (
            SELECT DISTINCT t200_activo.f200_nit
            FROM unoee.dbo.t200_mm_terceros AS t200_activo 
                INNER JOIN unoee.dbo.[w0550_contratos] c_activo
                    ON c_activo.[c0550_rowid_tercero] = t200_activo.f200_rowid
            WHERE c_activo.c0550_ind_estado = 1
                AND t200_activo.f200_nit IS NOT NULL
        );
`

export const users = `
    SELECT DISTINCT 
        CASE 
            WHEN c0540_id_cia = 1 THEN 'New Stetic' 
            ELSE 'Temporal' 
        END AS Empresa,
        
        CASE 
            WHEN [w0550_contratos].c0550_ind_estado = 1 THEN 'ACTIVO' 
            ELSE 'INACTIVO'
        END AS ESTADO,
        
        t200.f200_nit,
        f200_id_tipo_ident AS "Tipo de identificacion",
        t200.f200_apellido1,
        t200.f200_apellido2,
        t200.f200_nombres,
        f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2 AS Nombre,
        
        c0540_id_cia AS id_compañia,
        
        CONVERT(NVARCHAR, [w0550_contratos].c0550_fecha_ingreso, 112) AS [Fecha de ingreso],
        CONVERT(NVARCHAR, c0540_fecha_nacimiento, 112) AS [Fecha de nacimiento],
        CONVERT(NVARCHAR, w0540_empleados.c0540_fecha_exp_identif, 112) AS "fecha de expedicion",
        CONVERT(VARCHAR(6), [w0550_contratos].c0550_fecha_ingreso, 112) AS PeriodoIngreso,
        [w0550_contratos].[c0550_fecha_retiro] AS [Fecha de Retiro],
        c0540_fecha_nacimiento AS [Fecha de nacimiento],
        
        w0540_empleados.c0540_id_pais_nacimiento,
        w0540_empleados.c0540_id_depto_nacimiento,
        w0540_empleados.c0540_id_ciudad_nacimiento,
        w0540_empleados.c0540_id_pais_exp_identif,
        w0540_empleados.c0540_id_depto_exp_identif,
        w0540_empleados.c0540_id_ciudad_exp_identif,
        
        w0540_empleados.c0540_ind_sexo,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'Hombre' 
            ELSE 'Mujer' 
        END AS Genero,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'M' 
            ELSE 'F' 
        END AS Genero2,
        
        w0540_empleados.c0540_ind_extranjero,
        f200_ind_empleado,
        c0540_ind_declarante,
        [w0550_contratos].c0550_ind_estado AS [Estado Empleado],
        
        CARGOS.C0763_ID AS Cargo,
        CARGOS.C0763_DESCRIPCION AS "Desc. Cargo",
        cco.f284_id AS Id_cco,
        cco.f284_descripcion AS [Centro de costos],
        [f107_descripcion] AS Gerencia,
        
        grupo_emp.c0510_id AS [Id_Grupo empleado],
        CASE 
            WHEN [c0510_descripcion] IN ('EXPORTACIONES', 'VENTAS NACIONALES') THEN 'VENTAS' 
            ELSE [c0510_descripcion] 
        END AS [Grupo empleado],
        
        ISNULL(indestcivil.c0006_descripcion, '') AS [Estado civil],
        CASE 
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Casado' THEN 2
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Divorciado' THEN 4
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Soltero' THEN 1
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Union libre' THEN 5
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Viudo' THEN 3
            ELSE 0
        END AS ind_estado_civil,
        
        T18.c0006_descripcion AS [Tipo de contrato],
        [c0702_descripcion] AS [Nivel educativo],
        
        [f015_email] AS [Correo Electronico],
        f013_descripcion AS Ciudad,
        [f012_descripcion] AS Departamento,
        [f011_descripcion] AS Pais,
        
        Proceso.Proceso

    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid

        LEFT JOIN unoee.dbo.t210_mm_vendedores 
            ON [f210_rowid_tercero] = t200.f200_rowid
        
        LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
            ON cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        
        LEFT JOIN unoee.dbo.W0763_GH01_CARGOS CARGOS 
            ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        
        LEFT JOIN unoee.dbo.[t107_mc_proyectos] 
            ON f107_id = [w0550_contratos].c0550_id_proyecto 
            AND [f107_id_cia] = [w0550_contratos].c0550_id_cia
        
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
            ON grupo_emp.[c0510_rowid] = [w0550_contratos].c0550_rowid_grupo_empleados

        LEFT JOIN unoee.dbo.t015_mm_contactos 
            ON t015_mm_contactos.[f015_rowid] = t200.[f200_rowid_contacto]
        
        LEFT OUTER JOIN Unoee.dbo.t011_mm_paises AS C011 
            ON f015_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t012_mm_deptos AS C012 
            ON f015_id_depto = C012.f012_id 
            AND C012.f012_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t013_mm_ciudades AS T013 
            ON f015_id_ciudad = T013.f013_id 
            AND T013.f013_id_depto = C012.f012_id 
            AND T013.f013_id_pais = C011.f011_id

        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil 
            ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
            AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        
        LEFT JOIN unoee.dbo.w0003_lenguajes 
            ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
        
        LEFT OUTER JOIN unoee.dbo.w0006_tipos AS T18 
            ON T18.c0006_id_tipo = 'c0550_ind_termino' 
            AND T18.c0006_id_lenguaje = 1 
            AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        
        LEFT OUTER JOIN [Unoee].[dbo].[w0702_gh01_nivel_academico] AS Nivel_academico 
            ON [c0702_rowid] = w0540_empleados.[c0540_id_nivel_educativo]

        LEFT OUTER JOIN (
            SELECT 
                v743.v743_rowid,
                v743_texto AS Proceso 
            FROM [Unoee].[dbo].[t743_mm_entidad_atributo] AS Atributo
                INNER JOIN unoee.dbo.[v743] AS v743 
                    ON Atributo.[f743_rowid] = v743_rowid_entidad_atributo
            WHERE atributo.f743_rowid_entidad = '108' 
                AND f743_ind_tipo_atributo = '7' 
                AND f743_rowid_maestro = 143 
                AND v743_rowid_entidad_atributo = 1478
        ) AS Proceso
            ON Proceso.v743_rowid = [w0550_contratos].c0550_rowid_movto_entidad

        LEFT JOIN (
            SELECT DISTINCT
                terc.f200_id AS Cedula,
                CONVERT(VARCHAR(1), contra.c0550_id) AS id_Contrato,
                [c0555_id] AS idmotivo,
                contra.[c0550_fecha_retiro] AS fechaRetiro,
                [c0555_descripcion],
                [c0555_notas] AS notas_retiro,
                [c0555_ind_lista_negra],
                [c0555_ind_indemnizacion],
                mvto.c0602_id_cia
            FROM unoee.dbo.w0602_movto_nomina AS mvto  
                INNER JOIN unoee.dbo.t200_mm_terceros terc 
                    ON terc.f200_rowid = mvto.c0602_rowid_tercero  
                INNER JOIN unoee.dbo.w0600_docto_nomina docto 
                    ON mvto.c0602_rowid_docto_nm = docto.c0600_rowid   
                INNER JOIN unoee.dbo.w0501_conceptos cpto      
                    ON cpto.c0501_rowid = mvto.c0602_rowid_concepto  
                INNER JOIN unoee.dbo.w0550_contratos contra      
                    ON contra.c0550_rowid = mvto.c0602_rowid_contrato     
                LEFT JOIN unoee.dbo.t285_co_centro_op co  	
                    ON co.f285_id_cia = mvto.c0602_id_cia 
                    AND co.f285_id = mvto.c0602_id_co_mov
                LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
                    ON cco.f284_rowid = mvto.c0602_rowid_ccosto_mov
                    AND cco.f284_id_cia = mvto.c0602_id_cia
                LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
                    ON grupo_emp.[c0510_rowid] = contra.c0550_rowid_grupo_empleados
                LEFT JOIN unoee.dbo.[w0555_motivos_retiro] 
                    ON [c0550_id_motivo_retiro] = [c0555_id]
            WHERE docto.c0600_id_periodo >= '202207'
                AND mvto.c0602_id_cia IN ('1','8','9')
        ) AS Retiros
            ON retiros.Cedula = t200.f200_nit 
            AND retiros.c0602_id_cia = c0540_id_cia

    WHERE (w0003_lenguajes.c0003_id IN (1)) 
    AND [w0550_contratos].c0550_ind_estado = 1
    AND Retiros.fechaRetiro IS NULL

    ORDER BY f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2

    OFFSET (@page - 1) * @limit ROWS FETCH NEXT @limit ROWS ONLY;
`

export const usersByProperties = `
    SELECT DISTINCT 
        CASE 
            WHEN c0540_id_cia = 1 THEN 'New Stetic' 
            ELSE 'Temporal' 
        END AS Empresa,
        
        CASE 
            WHEN [w0550_contratos].c0550_ind_estado = 1 THEN 'ACTIVO' 
            ELSE 'INACTIVO'
        END AS ESTADO,
        
        t200.f200_nit,
        f200_id_tipo_ident AS "Tipo de identificacion",
        t200.f200_apellido1,
        t200.f200_apellido2,
        t200.f200_nombres,
        f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2 AS Nombre,
        
        c0540_id_cia AS id_compañia,
        
        CONVERT(NVARCHAR, [w0550_contratos].c0550_fecha_ingreso, 112) AS [Fecha de ingreso],
        CONVERT(NVARCHAR, c0540_fecha_nacimiento, 112) AS [Fecha de nacimiento],
        CONVERT(NVARCHAR, w0540_empleados.c0540_fecha_exp_identif, 112) AS "fecha de expedicion",
        CONVERT(VARCHAR(6), [w0550_contratos].c0550_fecha_ingreso, 112) AS PeriodoIngreso,
        [w0550_contratos].[c0550_fecha_retiro] AS [Fecha de Retiro],
        c0540_fecha_nacimiento AS [Fecha de nacimiento],
        
        w0540_empleados.c0540_id_pais_nacimiento,
        w0540_empleados.c0540_id_depto_nacimiento,
        w0540_empleados.c0540_id_ciudad_nacimiento,
        w0540_empleados.c0540_id_pais_exp_identif,
        w0540_empleados.c0540_id_depto_exp_identif,
        w0540_empleados.c0540_id_ciudad_exp_identif,
        
        w0540_empleados.c0540_ind_sexo,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'Hombre' 
            ELSE 'Mujer' 
        END AS Genero,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'M' 
            ELSE 'F' 
        END AS Genero2,
        
        w0540_empleados.c0540_ind_extranjero,
        f200_ind_empleado,
        c0540_ind_declarante,
        [w0550_contratos].c0550_ind_estado AS [Estado Empleado],
        
        CARGOS.C0763_ID AS Cargo,
        CARGOS.C0763_DESCRIPCION AS "Desc. Cargo",
        cco.f284_id AS Id_cco,
        cco.f284_descripcion AS [Centro de costos],
        [f107_descripcion] AS Gerencia,
        
        grupo_emp.c0510_id AS [Id_Grupo empleado],
        CASE 
            WHEN [c0510_descripcion] IN ('EXPORTACIONES', 'VENTAS NACIONALES') THEN 'VENTAS' 
            ELSE [c0510_descripcion] 
        END AS [Grupo empleado],
        
        ISNULL(indestcivil.c0006_descripcion, '') AS [Estado civil],
        CASE 
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Casado' THEN 2
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Divorciado' THEN 4
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Soltero' THEN 1
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Union libre' THEN 5
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Viudo' THEN 3
            ELSE 0
        END AS ind_estado_civil,
        
        T18.c0006_descripcion AS [Tipo de contrato],
        [c0702_descripcion] AS [Nivel educativo],
        
        [f015_email] AS [Correo Electronico],
        f013_descripcion AS Ciudad,
        [f012_descripcion] AS Departamento,
        [f011_descripcion] AS Pais,
        
        Proceso.Proceso

    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid

        LEFT JOIN unoee.dbo.t210_mm_vendedores 
            ON [f210_rowid_tercero] = t200.f200_rowid
        
        LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
            ON cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        
        LEFT JOIN unoee.dbo.W0763_GH01_CARGOS CARGOS 
            ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        
        LEFT JOIN unoee.dbo.[t107_mc_proyectos] 
            ON f107_id = [w0550_contratos].c0550_id_proyecto 
            AND [f107_id_cia] = [w0550_contratos].c0550_id_cia
        
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
            ON grupo_emp.[c0510_rowid] = [w0550_contratos].c0550_rowid_grupo_empleados

        LEFT JOIN unoee.dbo.t015_mm_contactos 
            ON t015_mm_contactos.[f015_rowid] = t200.[f200_rowid_contacto]
        
        LEFT OUTER JOIN Unoee.dbo.t011_mm_paises AS C011 
            ON f015_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t012_mm_deptos AS C012 
            ON f015_id_depto = C012.f012_id 
            AND C012.f012_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t013_mm_ciudades AS T013 
            ON f015_id_ciudad = T013.f013_id 
            AND T013.f013_id_depto = C012.f012_id 
            AND T013.f013_id_pais = C011.f011_id

        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil 
            ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
            AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        
        LEFT JOIN unoee.dbo.w0003_lenguajes 
            ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
        
        LEFT OUTER JOIN unoee.dbo.w0006_tipos AS T18 
            ON T18.c0006_id_tipo = 'c0550_ind_termino' 
            AND T18.c0006_id_lenguaje = 1 
            AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        
        LEFT OUTER JOIN [Unoee].[dbo].[w0702_gh01_nivel_academico] AS Nivel_academico 
            ON [c0702_rowid] = w0540_empleados.[c0540_id_nivel_educativo]

        LEFT OUTER JOIN (
            SELECT 
                v743.v743_rowid,
                v743_texto AS Proceso 
            FROM [Unoee].[dbo].[t743_mm_entidad_atributo] AS Atributo
                INNER JOIN unoee.dbo.[v743] AS v743 
                    ON Atributo.[f743_rowid] = v743_rowid_entidad_atributo
            WHERE atributo.f743_rowid_entidad = '108' 
                AND f743_ind_tipo_atributo = '7' 
                AND f743_rowid_maestro = 143 
                AND v743_rowid_entidad_atributo = 1478
        ) AS Proceso
            ON Proceso.v743_rowid = [w0550_contratos].c0550_rowid_movto_entidad

        LEFT JOIN (
            SELECT DISTINCT
                terc.f200_id AS Cedula,
                CONVERT(VARCHAR(1), contra.c0550_id) AS id_Contrato,
                [c0555_id] AS idmotivo,
                contra.[c0550_fecha_retiro] AS fechaRetiro,
                [c0555_descripcion],
                [c0555_notas] AS notas_retiro,
                [c0555_ind_lista_negra],
                [c0555_ind_indemnizacion],
                mvto.c0602_id_cia
            FROM unoee.dbo.w0602_movto_nomina AS mvto  
                INNER JOIN unoee.dbo.t200_mm_terceros terc 
                    ON terc.f200_rowid = mvto.c0602_rowid_tercero  
                INNER JOIN unoee.dbo.w0600_docto_nomina docto 
                    ON mvto.c0602_rowid_docto_nm = docto.c0600_rowid   
                INNER JOIN unoee.dbo.w0501_conceptos cpto      
                    ON cpto.c0501_rowid = mvto.c0602_rowid_concepto  
                INNER JOIN unoee.dbo.w0550_contratos contra      
                    ON contra.c0550_rowid = mvto.c0602_rowid_contrato     
                LEFT JOIN unoee.dbo.t285_co_centro_op co  	
                    ON co.f285_id_cia = mvto.c0602_id_cia 
                    AND co.f285_id = mvto.c0602_id_co_mov
                LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
                    ON cco.f284_rowid = mvto.c0602_rowid_ccosto_mov
                    AND cco.f284_id_cia = mvto.c0602_id_cia
                LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
                    ON grupo_emp.[c0510_rowid] = contra.c0550_rowid_grupo_empleados
                LEFT JOIN unoee.dbo.[w0555_motivos_retiro] 
                    ON [c0550_id_motivo_retiro] = [c0555_id]
            WHERE docto.c0600_id_periodo >= '202207'
                AND mvto.c0602_id_cia IN ('1','8','9')
        ) AS Retiros
            ON retiros.Cedula = t200.f200_nit 
            AND retiros.c0602_id_cia = c0540_id_cia

    WHERE (w0003_lenguajes.c0003_id IN (1)) 
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

    ORDER BY f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2

`

export const usersIdles = `
    SELECT DISTINCT 

        CASE 
            WHEN c0540_id_cia = 1 THEN 'New Stetic' 
            ELSE 'Temporal' 
        END AS Empresa,
        
        CASE 
            WHEN [w0550_contratos].c0550_ind_estado = 1 THEN 'ACTIVO' 
            ELSE 'INACTIVO'
        END AS ESTADO,
        
        t200.f200_nit,
        t200.f200_nit AS Cedula,
        f200_id_tipo_ident AS "Tipo de identificacion",
        t200.f200_apellido1 AS Apellido1,
        t200.f200_apellido2 AS Apellido2,
        t200.f200_nombres AS Nombres,
        f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2 AS Nombre,
        
        c0540_id_cia AS id_compañia,
        
        CONVERT(NVARCHAR, [w0550_contratos].c0550_fecha_ingreso, 112) AS [Fecha de ingreso],
        CONVERT(NVARCHAR, c0540_fecha_nacimiento, 112) AS [Fecha de nacimiento],
        CONVERT(NVARCHAR, w0540_empleados.c0540_fecha_exp_identif, 112) AS "fecha de expedicion",
        CONVERT(VARCHAR(6), [w0550_contratos].c0550_fecha_ingreso, 112) AS PeriodoIngreso,
        [w0550_contratos].[c0550_fecha_retiro] AS [Fecha de Retiro],
        c0540_fecha_nacimiento AS [Fecha de nacimiento],
        
        w0540_empleados.c0540_id_pais_nacimiento AS Pais_Nacimiento_ID,
        w0540_empleados.c0540_id_depto_nacimiento AS Depto_Nacimiento_ID,
        w0540_empleados.c0540_id_ciudad_nacimiento AS Ciudad_Nacimiento_ID,
        w0540_empleados.c0540_id_pais_exp_identif AS Pais_Expedicion_ID,
        w0540_empleados.c0540_id_depto_exp_identif AS Depto_Expedicion_ID,
        w0540_empleados.c0540_id_ciudad_exp_identif AS Ciudad_Expedicion_ID,
        
        w0540_empleados.c0540_ind_sexo AS Sexo_Codigo,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'Hombre' 
            ELSE 'Mujer' 
        END AS Genero,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'M' 
            ELSE 'F' 
        END AS Genero2,
        
        w0540_empleados.c0540_ind_extranjero AS Es_Extranjero,
        f200_ind_empleado AS Es_Empleado,
        c0540_ind_declarante AS Es_Declarante,
        [w0550_contratos].c0550_ind_estado AS [Estado Empleado],
        
        CARGOS.C0763_ID AS Cargo_ID,
        CARGOS.C0763_DESCRIPCION AS "Desc. Cargo",
        cco.f284_id AS Id_cco,
        cco.f284_descripcion AS [Centro de costos],
        [f107_descripcion] AS Gerencia,
        
        grupo_emp.c0510_id AS [Id_Grupo empleado],
        CASE 
            WHEN [c0510_descripcion] IN ('EXPORTACIONES', 'VENTAS NACIONALES') THEN 'VENTAS' 
            ELSE [c0510_descripcion] 
        END AS [Grupo empleado],
        
        ISNULL(indestcivil.c0006_descripcion, '') AS [Estado civil],
        CASE 
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Casado' THEN 2
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Divorciado' THEN 4
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Soltero' THEN 1
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Union libre' THEN 5
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Viudo' THEN 3
            ELSE 0
        END AS ind_estado_civil,
        
        T18.c0006_descripcion AS [Tipo de contrato],
        [c0702_descripcion] AS [Nivel educativo],
        
        [f015_email] AS [Correo Electronico],
        f013_descripcion AS Ciudad,
        [f012_descripcion] AS Departamento,
        [f011_descripcion] AS Pais,
        
        Proceso.Proceso AS Proceso_Asociado

    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid

        LEFT JOIN unoee.dbo.t210_mm_vendedores 
            ON [f210_rowid_tercero] = t200.f200_rowid
        
        LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
            ON cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        
        LEFT JOIN unoee.dbo.W0763_GH01_CARGOS CARGOS 
            ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        
        LEFT JOIN unoee.dbo.[t107_mc_proyectos] 
            ON f107_id = [w0550_contratos].c0550_id_proyecto 
            AND [f107_id_cia] = [w0550_contratos].c0550_id_cia
        
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
            ON grupo_emp.[c0510_rowid] = [w0550_contratos].c0550_rowid_grupo_empleados

        LEFT JOIN unoee.dbo.t015_mm_contactos 
            ON t015_mm_contactos.[f015_rowid] = t200.[f200_rowid_contacto]
        
        LEFT OUTER JOIN Unoee.dbo.t011_mm_paises AS C011 
            ON f015_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t012_mm_deptos AS C012 
            ON f015_id_depto = C012.f012_id 
            AND C012.f012_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t013_mm_ciudades AS T013 
            ON f015_id_ciudad = T013.f013_id 
            AND T013.f013_id_depto = C012.f012_id 
            AND T013.f013_id_pais = C011.f011_id

        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil 
            ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
            AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        
        LEFT JOIN unoee.dbo.w0003_lenguajes 
            ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
        
        LEFT OUTER JOIN unoee.dbo.w0006_tipos AS T18 
            ON T18.c0006_id_tipo = 'c0550_ind_termino' 
            AND T18.c0006_id_lenguaje = 1 
            AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        
        LEFT OUTER JOIN [Unoee].[dbo].[w0702_gh01_nivel_academico] AS Nivel_academico 
            ON [c0702_rowid] = w0540_empleados.[c0540_id_nivel_educativo]

        LEFT OUTER JOIN (
            SELECT 
                v743.v743_rowid,
                v743_texto AS Proceso 
            FROM [Unoee].[dbo].[t743_mm_entidad_atributo] AS Atributo
                INNER JOIN unoee.dbo.[v743] AS v743 
                    ON Atributo.[f743_rowid] = v743_rowid_entidad_atributo
            WHERE atributo.f743_rowid_entidad = '108' 
                AND f743_ind_tipo_atributo = '7' 
                AND f743_rowid_maestro = 143 
                AND v743_rowid_entidad_atributo = 1478
        ) AS Proceso
            ON Proceso.v743_rowid = [w0550_contratos].c0550_rowid_movto_entidad

        LEFT JOIN (
            SELECT DISTINCT
                terc.f200_id AS Cedula,
                CONVERT(VARCHAR(1), contra.c0550_id) AS id_Contrato,
                [c0555_id] AS idmotivo,
                contra.[c0550_fecha_retiro] AS fechaRetiro,
                [c0555_descripcion] AS motivo_retiro,
                [c0555_notas] AS notas_retiro,
                [c0555_ind_lista_negra] AS lista_negra,
                [c0555_ind_indemnizacion] AS indemnizacion,
                mvto.c0602_id_cia
            FROM unoee.dbo.w0602_movto_nomina AS mvto  
                INNER JOIN unoee.dbo.t200_mm_terceros terc 
                    ON terc.f200_rowid = mvto.c0602_rowid_tercero  
                INNER JOIN unoee.dbo.w0600_docto_nomina docto 
                    ON mvto.c0602_rowid_docto_nm = docto.c0600_rowid   
                INNER JOIN unoee.dbo.w0501_conceptos cpto      
                    ON cpto.c0501_rowid = mvto.c0602_rowid_concepto  
                INNER JOIN unoee.dbo.w0550_contratos contra      
                    ON contra.c0550_rowid = mvto.c0602_rowid_contrato     
                LEFT JOIN unoee.dbo.t285_co_centro_op co  	
                    ON co.f285_id_cia = mvto.c0602_id_cia 
                    AND co.f285_id = mvto.c0602_id_co_mov
                LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
                    ON cco.f284_rowid = mvto.c0602_rowid_ccosto_mov
                    AND cco.f284_id_cia = mvto.c0602_id_cia
                LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
                    ON grupo_emp.[c0510_rowid] = contra.c0550_rowid_grupo_empleados
                LEFT JOIN unoee.dbo.[w0555_motivos_retiro] 
                    ON [c0550_id_motivo_retiro] = [c0555_id]
            WHERE docto.c0600_id_periodo >= '202207'  -- Solo períodos desde julio 2022
                AND mvto.c0602_id_cia IN ('1','8','9') -- Solo compañías específicas
        ) AS Retiros
            ON retiros.Cedula = t200.f200_nit 
            AND retiros.c0602_id_cia = c0540_id_cia

    WHERE (w0003_lenguajes.c0003_id IN (1))  -- Filtro por lenguaje
        AND [w0550_contratos].c0550_ind_estado != 1  -- Solo contratos INACTIVOS
        AND t200.f200_nit NOT IN (  -- Excluir empleados con contratos ACTIVOS
            SELECT DISTINCT t200_activo.f200_nit
            FROM unoee.dbo.t200_mm_terceros AS t200_activo 
                INNER JOIN unoee.dbo.[w0550_contratos] c_activo
                    ON c_activo.[c0550_rowid_tercero] = t200_activo.f200_rowid
            WHERE c_activo.c0550_ind_estado = 1  -- Contratos activos
                AND t200_activo.f200_nit IS NOT NULL  -- Evitar NULLs
        )

    ORDER BY f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2

    OFFSET (@page - 1) * @limit ROWS FETCH NEXT @limit ROWS ONLY;
`

export const usersIdlesByProperties = `
    SELECT DISTINCT 

        CASE 
            WHEN c0540_id_cia = 1 THEN 'New Stetic' 
            ELSE 'Temporal' 
        END AS Empresa,
        
        CASE 
            WHEN [w0550_contratos].c0550_ind_estado = 1 THEN 'ACTIVO' 
            ELSE 'INACTIVO'
        END AS ESTADO,
        
        t200.f200_nit,
        t200.f200_nit AS Cedula,
        f200_id_tipo_ident AS "Tipo de identificacion",
        t200.f200_apellido1 AS Apellido1,
        t200.f200_apellido2 AS Apellido2,
        t200.f200_nombres AS Nombres,
        f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2 AS Nombre,
        
        c0540_id_cia AS id_compañia,
        
        CONVERT(NVARCHAR, [w0550_contratos].c0550_fecha_ingreso, 112) AS [Fecha de ingreso],
        CONVERT(NVARCHAR, c0540_fecha_nacimiento, 112) AS [Fecha de nacimiento],
        CONVERT(NVARCHAR, w0540_empleados.c0540_fecha_exp_identif, 112) AS "fecha de expedicion",
        CONVERT(VARCHAR(6), [w0550_contratos].c0550_fecha_ingreso, 112) AS PeriodoIngreso,
        [w0550_contratos].[c0550_fecha_retiro] AS [Fecha de Retiro],
        c0540_fecha_nacimiento AS [Fecha de nacimiento],
        
        w0540_empleados.c0540_id_pais_nacimiento AS Pais_Nacimiento_ID,
        w0540_empleados.c0540_id_depto_nacimiento AS Depto_Nacimiento_ID,
        w0540_empleados.c0540_id_ciudad_nacimiento AS Ciudad_Nacimiento_ID,
        w0540_empleados.c0540_id_pais_exp_identif AS Pais_Expedicion_ID,
        w0540_empleados.c0540_id_depto_exp_identif AS Depto_Expedicion_ID,
        w0540_empleados.c0540_id_ciudad_exp_identif AS Ciudad_Expedicion_ID,
        
        w0540_empleados.c0540_ind_sexo AS Sexo_Codigo,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'Hombre' 
            ELSE 'Mujer' 
        END AS Genero,
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'M' 
            ELSE 'F' 
        END AS Genero2,
        
        w0540_empleados.c0540_ind_extranjero AS Es_Extranjero,
        f200_ind_empleado AS Es_Empleado,
        c0540_ind_declarante AS Es_Declarante,
        [w0550_contratos].c0550_ind_estado AS [Estado Empleado],
        
        CARGOS.C0763_ID AS Cargo_ID,
        CARGOS.C0763_DESCRIPCION AS "Desc. Cargo",
        cco.f284_id AS Id_cco,
        cco.f284_descripcion AS [Centro de costos],
        [f107_descripcion] AS Gerencia,
        
        grupo_emp.c0510_id AS [Id_Grupo empleado],
        CASE 
            WHEN [c0510_descripcion] IN ('EXPORTACIONES', 'VENTAS NACIONALES') THEN 'VENTAS' 
            ELSE [c0510_descripcion] 
        END AS [Grupo empleado],
        
        ISNULL(indestcivil.c0006_descripcion, '') AS [Estado civil],
        CASE 
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Casado' THEN 2
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Divorciado' THEN 4
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Soltero' THEN 1
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Union libre' THEN 5
            WHEN ISNULL(indestcivil.c0006_descripcion, '') = 'Viudo' THEN 3
            ELSE 0
        END AS ind_estado_civil,
        
        T18.c0006_descripcion AS [Tipo de contrato],
        [c0702_descripcion] AS [Nivel educativo],
        
        [f015_email] AS [Correo Electronico],
        f013_descripcion AS Ciudad,
        [f012_descripcion] AS Departamento,
        [f011_descripcion] AS Pais,
        
        Proceso.Proceso AS Proceso_Asociado

    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid

        LEFT JOIN unoee.dbo.t210_mm_vendedores 
            ON [f210_rowid_tercero] = t200.f200_rowid
        
        LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
            ON cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        
        LEFT JOIN unoee.dbo.W0763_GH01_CARGOS CARGOS 
            ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        
        LEFT JOIN unoee.dbo.[t107_mc_proyectos] 
            ON f107_id = [w0550_contratos].c0550_id_proyecto 
            AND [f107_id_cia] = [w0550_contratos].c0550_id_cia
        
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
            ON grupo_emp.[c0510_rowid] = [w0550_contratos].c0550_rowid_grupo_empleados

        LEFT JOIN unoee.dbo.t015_mm_contactos 
            ON t015_mm_contactos.[f015_rowid] = t200.[f200_rowid_contacto]
        
        LEFT OUTER JOIN Unoee.dbo.t011_mm_paises AS C011 
            ON f015_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t012_mm_deptos AS C012 
            ON f015_id_depto = C012.f012_id 
            AND C012.f012_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t013_mm_ciudades AS T013 
            ON f015_id_ciudad = T013.f013_id 
            AND T013.f013_id_depto = C012.f012_id 
            AND T013.f013_id_pais = C011.f011_id

        LEFT JOIN unoee.dbo.w0006_tipos AS indestcivil 
            ON indestcivil.c0006_id_tipo = 'c0540_ind_estado_civil' 
            AND indestcivil.c0006_valor = w0540_empleados.[c0540_ind_estado_civil]
        
        LEFT JOIN unoee.dbo.w0003_lenguajes 
            ON w0003_lenguajes.c0003_id = indestcivil.c0006_id_lenguaje 
        
        LEFT OUTER JOIN unoee.dbo.w0006_tipos AS T18 
            ON T18.c0006_id_tipo = 'c0550_ind_termino' 
            AND T18.c0006_id_lenguaje = 1 
            AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        
        LEFT OUTER JOIN [Unoee].[dbo].[w0702_gh01_nivel_academico] AS Nivel_academico 
            ON [c0702_rowid] = w0540_empleados.[c0540_id_nivel_educativo]

        LEFT OUTER JOIN (
            SELECT 
                v743.v743_rowid,
                v743_texto AS Proceso 
            FROM [Unoee].[dbo].[t743_mm_entidad_atributo] AS Atributo
                INNER JOIN unoee.dbo.[v743] AS v743 
                    ON Atributo.[f743_rowid] = v743_rowid_entidad_atributo
            WHERE atributo.f743_rowid_entidad = '108' 
                AND f743_ind_tipo_atributo = '7' 
                AND f743_rowid_maestro = 143 
                AND v743_rowid_entidad_atributo = 1478
        ) AS Proceso
            ON Proceso.v743_rowid = [w0550_contratos].c0550_rowid_movto_entidad

        LEFT JOIN (
            SELECT DISTINCT
                terc.f200_id AS Cedula,
                CONVERT(VARCHAR(1), contra.c0550_id) AS id_Contrato,
                [c0555_id] AS idmotivo,
                contra.[c0550_fecha_retiro] AS fechaRetiro,
                [c0555_descripcion] AS motivo_retiro,
                [c0555_notas] AS notas_retiro,
                [c0555_ind_lista_negra] AS lista_negra,
                [c0555_ind_indemnizacion] AS indemnizacion,
                mvto.c0602_id_cia
            FROM unoee.dbo.w0602_movto_nomina AS mvto  
                INNER JOIN unoee.dbo.t200_mm_terceros terc 
                    ON terc.f200_rowid = mvto.c0602_rowid_tercero  
                INNER JOIN unoee.dbo.w0600_docto_nomina docto 
                    ON mvto.c0602_rowid_docto_nm = docto.c0600_rowid   
                INNER JOIN unoee.dbo.w0501_conceptos cpto      
                    ON cpto.c0501_rowid = mvto.c0602_rowid_concepto  
                INNER JOIN unoee.dbo.w0550_contratos contra      
                    ON contra.c0550_rowid = mvto.c0602_rowid_contrato     
                LEFT JOIN unoee.dbo.t285_co_centro_op co  	
                    ON co.f285_id_cia = mvto.c0602_id_cia 
                    AND co.f285_id = mvto.c0602_id_co_mov
                LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
                    ON cco.f284_rowid = mvto.c0602_rowid_ccosto_mov
                    AND cco.f284_id_cia = mvto.c0602_id_cia
                LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
                    ON grupo_emp.[c0510_rowid] = contra.c0550_rowid_grupo_empleados
                LEFT JOIN unoee.dbo.[w0555_motivos_retiro] 
                    ON [c0550_id_motivo_retiro] = [c0555_id]
            WHERE docto.c0600_id_periodo >= '202207'  
                AND mvto.c0602_id_cia IN ('1','8','9') 
        ) AS Retiros
            ON retiros.Cedula = t200.f200_nit 
            AND retiros.c0602_id_cia = c0540_id_cia

    WHERE (w0003_lenguajes.c0003_id IN (1))  
        AND [w0550_contratos].c0550_ind_estado != 1  
        AND t200.f200_nit NOT IN ( 
            SELECT DISTINCT t200_activo.f200_nit
            FROM unoee.dbo.t200_mm_terceros AS t200_activo 
                INNER JOIN unoee.dbo.[w0550_contratos] c_activo
                    ON c_activo.[c0550_rowid_tercero] = t200_activo.f200_rowid
            WHERE c_activo.c0550_ind_estado = 1  -- Contratos activos
                AND t200_activo.f200_nit IS NOT NULL  -- Evitar NULLs
        )  
        AND (
            t200.f200_nit LIKE @property OR
            f200_nombres LIKE @property OR
            f200_apellido1 LIKE @property OR
            f200_apellido2 LIKE @property OR
            f015_email LIKE @property OR
            CARGOS.C0763_DESCRIPCION LIKE @property
        )

    ORDER BY f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2
`