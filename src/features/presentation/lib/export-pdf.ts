import { jsPDF } from 'jspdf'

type Slide = {
  id: string
  order: number
  title: string
  content: string
  notes?: string | null
  imageUrl?: string | null
}

type ExportOptions = {
  title: string
  slides: Slide[]
}

export async function exportToPdf({ title, slides }: ExportOptions) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // Set background color for all pages
  const setBackground = () => {
    doc.setFillColor(26, 26, 46) // #1a1a2e dark background
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
  }

  // Add cover slide
  setBackground()

  // Title on cover
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(32)
  doc.setTextColor(255, 255, 255)
  const titleLines = doc.splitTextToSize(title, contentWidth)
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 20, {
    align: 'center',
  })

  // Subtitle
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(200, 200, 200)
  doc.text('AI Generated Presentation', pageWidth / 2, pageHeight / 2 + 10, {
    align: 'center',
  })

  // Slide count
  doc.setFontSize(12)
  doc.text(`${slides.length} slides`, pageWidth / 2, pageHeight / 2 + 25, {
    align: 'center',
  })

  for (const slide of slides) {
    doc.addPage()
    setBackground()

    // Slide number badge
    doc.setFillColor(59, 130, 246) // blue-500
    doc.roundedRect(margin, margin, 25, 10, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(`Slide ${slide.order + 1}`, margin + 12.5, margin + 7, {
      align: 'center',
    })

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    const slideTitleLines = doc.splitTextToSize(slide.title, contentWidth)
    doc.text(slideTitleLines, margin, margin + 30)

    // Content
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.setTextColor(224, 224, 224)
    const contentLines = slide.content
      .split('\n')
      .filter(Boolean)
      .map((line) => (line.startsWith('•') ? line : `• ${line}`))
    const wrappedContent = doc.splitTextToSize(
      contentLines.join('\n'),
      contentWidth,
    )
    doc.text(wrappedContent, margin, margin + 50)

    // Notes
    if (slide.notes) {
      const notesY = pageHeight - margin - 30
      doc.setDrawColor(100, 100, 100)
      doc.setLineWidth(0.3)
      doc.line(margin, notesY - 5, pageWidth - margin, notesY - 5)

      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.setTextColor(180, 180, 180)
      doc.text('Speaker Notes:', margin, notesY + 5)
      doc.setFont('helvetica', 'normal')
      const notesLines = doc.splitTextToSize(slide.notes, contentWidth)
      doc.text(notesLines, margin, notesY + 15)
    }
  }

  const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
  doc.save(filename)

  return filename
}
