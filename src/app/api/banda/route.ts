import { NextResponse } from 'next/server';
import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";

export const dynamic = 'force-dynamic';

// Inicializamos el cliente de AWS con las credenciales de tu .env
const client = new CloudWatchClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET() {
    try {
        // Definimos el rango de tiempo: Desde el día 1 del mes actual, hasta HOY.
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const command = new GetMetricStatisticsCommand({
            Namespace: "AWS/EC2",
            MetricName: "NetworkOut",
            Dimensions: [
                {
                    Name: "InstanceId",
                    Value: process.env.EC2_INSTANCE_ID!,
                },
            ],
            StartTime: startOfMonth,
            EndTime: now,
            Period: 86400, // Agrupamos los datos por día (86400 segundos)
            Statistics: ["Sum"], // Queremos la suma total de bytes de salida
        });

        const response = await client.send(command);

        // AWS devuelve un array de "Datapoints" (uno por cada día). Los sumamos todos.
        let totalBytesOut = 0;
        if (response.Datapoints) {
            response.Datapoints.forEach(point => {
                totalBytesOut += point.Sum || 0;
            });
        }

        // Convertimos de Bytes a Gigabytes (GiB)
        const totalGB = totalBytesOut / 1_000_000_000;

        return NextResponse.json({
            success: true,
            consumedGB: parseFloat(totalGB.toFixed(2)),
            limitGB: 100,
            month: now.toLocaleString('es-ES', { month: 'long' })
        });

    } catch (error) {
        console.error("Error obteniendo métricas de AWS:", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
    }
}