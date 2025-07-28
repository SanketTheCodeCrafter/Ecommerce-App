import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import AdOrderDetails from './AdOrderDetails'

const AdminOrderView = () => {
  const [openDetailsDailog, setOpenDetailsDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>12345</TableCell>
              <TableCell>27/07/2025</TableCell>
              <TableCell>In Process</TableCell>
              <TableCell>$1000</TableCell>
              <TableCell>
                <Dialog open={openDetailsDailog} onOpenChange={setOpenDetailsDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={()=> setOpenDetailsDialog(true)}
                    >View Details</Button>
                  </DialogTrigger>
                  <AdOrderDetails />
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AdminOrderView