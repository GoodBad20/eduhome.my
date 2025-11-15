import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ScheduleActivity, ChildData } from '@/lib/services/parentService'

export interface SchedulePDFData {
  activities: ScheduleActivity[]
  child: ChildData | null
  dateRange: {
    start: string
    end: string
  }
  viewMode: 'day' | 'week' | 'month'
}

export class SchedulePDFGenerator {
  private pdf: jsPDF

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
  }

  async generateSchedulePDF(data: SchedulePDFData): Promise<void> {
    const { activities, child, dateRange, viewMode } = data

    // Set up PDF
    this.pdf.setFontSize(20)
    this.pdf.setFont('helvetica', 'bold')

    // Title
    const title = child ? `${child.name}'s Schedule` : 'Family Schedule'
    this.pdf.text(title, 20, 20)

    // Date range
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text(
      `${this.formatDate(dateRange.start)} - ${this.formatDate(dateRange.end)}`,
      20,
      30
    )

    let currentY = 45

    // Group activities by date
    const groupedActivities = this.groupActivitiesByDate(activities)

    // Sort dates
    const sortedDates = Object.keys(groupedActivities).sort()

    for (const date of sortedDates) {
      const dayActivities = groupedActivities[date]

      // Date header
      this.pdf.setFontSize(14)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(this.formatDate(date), 20, currentY)
      currentY += 8

      // Activities for this date
      for (const activity of dayActivities) {
        if (currentY > 270) {
          this.pdf.addPage()
          currentY = 20
        }

        // Time slot
        this.pdf.setFontSize(11)
        this.pdf.setFont('helvetica', 'normal')
        this.pdf.text(
          `${activity.start_time} - ${activity.end_time}`,
          25,
          currentY
        )

        // Activity details
        this.pdf.setFont('helvetica', 'bold')
        this.pdf.text(activity.title, 60, currentY)
        currentY += 5

        // Subject and location
        this.pdf.setFont('helvetica', 'normal')
        this.pdf.setFontSize(10)
        if (activity.subject) {
          this.pdf.text(`Subject: ${activity.subject}`, 60, currentY)
          currentY += 4
        }
        if (activity.location) {
          this.pdf.text(`Location: ${activity.location}`, 60, currentY)
          currentY += 4
        }
        if (activity.description) {
          this.pdf.text(`Notes: ${activity.description}`, 60, currentY)
          currentY += 4
        }

        currentY += 3
      }

      currentY += 5
    }

    // Footer
    this.pdf.setFontSize(8)
    this.pdf.setFont('helvetica', 'italic')
    this.pdf.text(
      `Generated on ${new Date().toLocaleDateString()} by EduHome`,
      20,
      285
    )

    // Save the PDF
    const fileName = `${title.replace(/\s+/g, '_')}_${dateRange.start}_${dateRange.end}.pdf`
    this.pdf.save(fileName)
  }

  private groupActivitiesByDate(activities: ScheduleActivity[]): { [date: string]: ScheduleActivity[] } {
    return activities.reduce((groups, activity) => {
      const date = activity.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
      // Sort by time
      groups[date].sort((a, b) => a.start_time.localeCompare(b.start_time))
      return groups
    }, {} as { [date: string]: ScheduleActivity[] })
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// Alternative: Generate PDF from HTML element
export async function generatePDFFromElement(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`)
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

// Print functionality
export function printSchedule(elementId: string): void {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`)
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Failed to open print window')
  }

  const elementHTML = element.innerHTML
  const printCSS = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        color: #000;
        background: #fff;
      }
      .schedule-print {
        max-width: 100%;
        margin: 0 auto;
      }
      .schedule-header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #106EBE;
        padding-bottom: 10px;
      }
      .schedule-date {
        font-weight: bold;
        color: #106EBE;
        margin: 15px 0 10px 0;
        font-size: 16px;
      }
      .activity-item {
        margin: 10px 0;
        padding: 8px;
        border-left: 4px solid #106EBE;
        background: #f8f9fa;
      }
      .activity-time {
        font-weight: bold;
        color: #333;
        margin-right: 10px;
      }
      .activity-title {
        font-weight: bold;
        margin-bottom: 3px;
      }
      .activity-details {
        font-size: 12px;
        color: #666;
        margin-left: 80px;
      }
      .no-activities {
        text-align: center;
        color: #666;
        font-style: italic;
        margin: 20px 0;
      }
      @media print {
        body { margin: 10px; }
        .no-print { display: none !important; }
      }
    </style>
  `

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Schedule Print</title>
        ${printCSS}
      </head>
      <body>
        <div class="schedule-print">
          ${elementHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}